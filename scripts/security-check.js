import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('\x1b[36m%s\x1b[0m', '🛡️  Running Repository Security & Integrity Check...');

let hasError = false;

function logError(message) {
  hasError = true;
  console.error('\x1b[31m%s\x1b[0m', `❌ [SECURITY ALERT] ${message}`);
}

function logSuccess(message) {
  console.log('\x1b[32m%s\x1b[0m', `✅ ${message}`);
}

// =========================================================================
// 1. Root & Critical Files Checks
// =========================================================================
const blockedRootFiles = ['api.js'];
for (const file of blockedRootFiles) {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    logError(`Blocked malicious file detected in repository root: "${file}". Delete this file immediately!`);
  }
}

// =========================================================================
// 2. package.json Integrity Checks
// =========================================================================
const packageJsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const scripts = pkg.scripts || {};

    for (const [name, command] of Object.entries(scripts)) {
      if (typeof command === 'string') {
        if (command.includes('api.js') || command.includes('node api.js')) {
          logError(`Dangerous command found in package.json script "${name}": "${command}". Remove references to api.js.`);
        }
        if (/curl\s+|wget\s+|powershell\s+-enc/i.test(command)) {
          logError(`Suspicious network download command found in package.json script "${name}": "${command}".`);
        }
      }
    }
  } catch (err) {
    logError(`Failed to parse package.json: ${err.message}`);
  }
}

// =========================================================================
// 3. PostCSS Configuration Strict Validation
// =========================================================================
const postCssConfigFiles = [
  'postcss.config.js',
  'postcss.config.cjs',
  'postcss.config.mjs',
  'postcss.config.ts',
];

for (const configFile of postCssConfigFiles) {
  const configPath = path.join(rootDir, configFile);
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, 'utf8');
      const lines = content.split(/\r?\n/);

      // Check for hidden payload lines with extreme length (malware typically hides on line 10 with 1,000+ chars)
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > 400) {
          logError(
            `Suspiciously long line (${lines[i].length} characters) detected in ${configFile} on line ${i + 1}. Config files must not contain minified/obfuscated code.`
          );
        }
      }

      // Prohibited keywords in PostCSS config files
      const prohibitedPatterns = [
        { name: 'eval / Function constructor', regex: /\beval\s*\(|new\s+Function\s*\(/ },
        { name: 'Base64 decoding (atob / Buffer)', regex: /\batob\s*\(|Buffer\.from\s*\([^)]*base64/ },
        { name: 'Child process execution', regex: /child_process|spawn\s*\(|exec\s*\(|fork\s*\(/ },
        { name: 'Network modules', regex: /node:http|node:https|node:net|node:dgram|\bhttps?:\/\//i },
        { name: 'Global namespace tampering', regex: /global\[|global\.[a-zA-Z0-9_$]+(\s*=|\s*\[)|globalThis\[/ },
      ];

      for (const { name, regex } of prohibitedPatterns) {
        if (regex.test(content)) {
          logError(`Forbidden malicious pattern (${name}) found in "${configFile}". PostCSS configs must only export styling plugins.`);
        }
      }
    } catch (err) {
      logError(`Error reading ${configFile}: ${err.message}`);
    }
  }
}

// =========================================================================
// 4. Public Directory & Font Security
// =========================================================================
const publicDir = path.join(rootDir, 'public');

// Disallowed executable extensions anywhere in public/
const BLOCKED_PUBLIC_EXTENSIONS = new Set([
  '.exe', '.dll', '.bat', '.cmd', '.sh', '.vbs', '.ps1', '.scr', '.pif', '.php', '.py', '.rb'
]);

// Font magic byte signatures
function isValidFontHeader(buffer, ext) {
  if (buffer.length < 4) return false;

  const hex = buffer.subarray(0, 4).toString('hex').toLowerCase();
  const ascii = buffer.subarray(0, 4).toString('ascii');

  switch (ext) {
    case '.woff':
      return ascii === 'wOFF';
    case '.woff2':
      return ascii === 'wOF2';
    case '.ttf':
      // 0x00010000 or 'true'
      return hex === '00010000' || ascii === 'true';
    case '.otf':
      // 'OTTO'
      return ascii === 'OTTO';
    case '.eot':
      // At offset 34, bytes are 0x4c 0x50 ('LP')
      if (buffer.length >= 36) {
        const magic = buffer.subarray(34, 36).toString('ascii');
        return magic === 'LP';
      }
      return false;
    default:
      return true;
  }
}

function scanPublicAndFontFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(rootDir, fullPath);

    if (entry.isDirectory()) {
      // If folder is named font or fonts, ensure no script files exist inside
      const isFontFolder = entry.name.toLowerCase().includes('font');
      if (isFontFolder) {
        verifyNoScriptsInFontDir(fullPath);
      }
      scanPublicAndFontFiles(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();

      // Check for forbidden executable file types in public
      if (BLOCKED_PUBLIC_EXTENSIONS.has(ext)) {
        logError(`Disallowed executable file found in public directory: "${relativePath}".`);
      }

      // Check SVG files for embedded script injection / XSS
      if (ext === '.svg') {
        try {
          const svgContent = fs.readFileSync(fullPath, 'utf8');
          if (/<script[\s>]/i.test(svgContent) || /on\w+\s*=/i.test(svgContent) || /javascript:/i.test(svgContent)) {
            logError(`Malicious script / XSS payload detected inside SVG file: "${relativePath}".`);
          }
        } catch {
          // ignore
        }
      }

      // Check font files integrity
      const fontExtensions = ['.woff', '.woff2', '.ttf', '.otf', '.eot'];
      if (fontExtensions.includes(ext)) {
        validateFontFile(fullPath, ext);
      }
    }
  }
}

function verifyNoScriptsInFontDir(fontDir) {
  const disallowedExtensions = new Set(['.js', '.cjs', '.mjs', '.ts', '.html', '.php', '.sh', '.bat']);
  const files = fs.readdirSync(fontDir, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const ext = path.extname(file.name).toLowerCase();
      if (disallowedExtensions.has(ext)) {
        const rel = path.relative(rootDir, path.join(fontDir, file.name));
        logError(`Disallowed script/code file detected in font directory: "${rel}". Font folders must only contain font assets.`);
      }
    }
  }
}

function validateFontFile(filePath, ext) {
  try {
    const buffer = fs.readFileSync(filePath);
    const relativePath = path.relative(rootDir, filePath);

    if (buffer.length === 0) {
      logError(`Empty font file detected: "${relativePath}".`);
      return;
    }

    // Check if the font file is actually a disguised text/script file
    const sample = buffer.subarray(0, Math.min(buffer.length, 100)).toString('utf8');
    if (
      /^\s*<\?php/i.test(sample) ||
      /^\s*<script/i.test(sample) ||
      /^\s*#!\/bin/i.test(sample) ||
      /^\s*var\s+/i.test(sample) ||
      /^\s*const\s+/i.test(sample) ||
      /^\s*import\s+/i.test(sample)
    ) {
      logError(`Disguised script payload detected as font file: "${relativePath}".`);
      return;
    }

    // Verify font header magic bytes
    if (!isValidFontHeader(buffer, ext)) {
      logError(`Font file "${relativePath}" has an invalid header and may be corrupted or disguised binary malware.`);
    }
  } catch (err) {
    logError(`Failed to read font file ${filePath}: ${err.message}`);
  }
}

scanPublicAndFontFiles(publicDir);

// Also scan src/ for any font folders
const srcDir = path.join(rootDir, 'src');
scanPublicAndFontFiles(srcDir);

// =========================================================================
// 5. Global Malware Signature Scanner
// =========================================================================
const MALICIOUS_PATTERNS = [
  {
    name: 'Known Malicious ETH Wallet Backdoor',
    regex: /0x1eEf0849EDa15d87f64e51C73C8442Cf3c8bCEF3/i,
  },
  {
    name: 'Obfuscated Hex Variable Backdoor Pattern',
    regex: /_0x9710a8|__0xadc80|__0x9daea/,
  },
  {
    name: 'Obfuscated atob/eval Payload',
    regex: /atob\(_0x[a-f0-9]+\);?\s*eval\(/i,
  },
  {
    name: 'Injected RPC Endpoints in Build/Config Files',
    regex: /(?:eth\.blockscout\.com|1rpc\.io\/eth|eth\.drpc\.org|ethereum-rpc\.publicnode\.com)/i,
    filterExtensions: ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.json'],
  },
];

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.husky', '.vscode']);
const SCANNABLE_EXTENSIONS = new Set(['.js', '.cjs', '.mjs', '.ts', '.tsx', '.json', '.html']);

function scanCodeDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        scanCodeDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (entry.name === 'package-lock.json' || entry.name === 'pnpm-lock.yaml') {
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (SCANNABLE_EXTENSIONS.has(ext)) {
        scanCodeFile(fullPath);
      }
    }
  }
}

function scanCodeFile(filePath) {
  if (path.resolve(filePath) === path.resolve(__filename)) {
    return;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(rootDir, filePath);

    for (const pattern of MALICIOUS_PATTERNS) {
      if (pattern.filterExtensions) {
        const ext = path.extname(filePath).toLowerCase();
        if (!pattern.filterExtensions.includes(ext)) {
          continue;
        }
      }

      if (pattern.regex.test(content)) {
        logError(`Malicious pattern detected (${pattern.name}) in "${relativePath}".`);
      }
    }
  } catch {
    // Ignore read errors for inaccessible files
  }
}

scanCodeDirectory(rootDir);

// =========================================================================
// 6. Summary and Exit Code
// =========================================================================
if (hasError) {
  console.error('\n\x1b[41m\x1b[37m%s\x1b[0m', ' 🛑 GIT ACTION BLOCKED: Security check failed! Fix the issues above before proceeding. ');
  process.exit(1);
} else {
  logSuccess('Security check passed. PostCSS configs, public/font assets, and codebase are clean.');
  process.exit(0);
}
