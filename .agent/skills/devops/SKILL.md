---
name: devops
description: DevOps engineering, cloud hosting, CI/CD, Git branch automation, and deployment management skill. Use when deploying applications to Vercel, Railway, Render, or Docker, configuring domain/DNS settings, managing GitHub Actions workflows, resolving deployment errors (500 server crashes, SSR hydration mismatches, build failures), and keeping branch merges in sync.
---

# DevOps & Deployment Skill (`devops`)

This skill provides operational workflows for continuous integration, continuous deployment, environment management, and branch synchronization across modern frontend and backend infrastructure.

---

## 1. Vercel Deployment & Troubleshooting Runbook

### Preventing SSR 500 Crashes in Next.js App Router
1. **Never use untrusted client-only libraries during SSR**:
   - If a library depends on `window` or `document` (or React Context providers like `HelmetProvider`), ensure:
     - Wrap in `"use client"` directive.
     - Protect with `typeof window !== "undefined"` or `useEffect`.
     - Or dynamically import with `{ ssr: false }`.
2. **Handle Missing Environment Variables**:
   - Next.js client bundles require `NEXT_PUBLIC_` prefix (e.g. `NEXT_PUBLIC_API_URL`).
   - If an API base URL is undefined in production, provide a fallback or throw explicit compile-time errors instead of unhandled runtime exceptions.

### Deployment Verification Checklist
```bash
# Test local production build before pushing to remote
pnpm build
# or
npm run build
```
Verify that all static routes (marked with `○`) and dynamic routes (marked with `ƒ`) compile with exit code 0.

---

## 2. Git Branch Synchronization Protocol

When maintaining development (`siam`) and production (`main`) branches:

```bash
# Step 1: Ensure working tree is clean and push feature branch
git add .
git commit -m "feat/fix: descriptive summary"
git push origin siam

# Step 2: Merge into main cleanly
git checkout main
git pull origin main
git merge siam --no-edit

# Step 3: Push to production to trigger automatic Vercel/Railway build
git push origin main

# Step 4: Return to development branch
git checkout siam
```

### Handling CRLF vs LF Line Endings on Windows
If git reports uncommitted changes on line endings during branch checkout:
```bash
git config core.autocrlf true
git add --renormalize .
git commit -m "fix: normalize line endings"
```

---

## 3. Backend Deployment (Railway / Render / Docker)

### Dockerfile Standard for Node.js / Express
```dockerfile
# Multi-stage production build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### Health Check Endpoint
Every backend service must expose `GET /health` or `GET /api/v1/health`:
```typescript
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
```

---

## 4. Secret & Environment Variable Management

- Never commit `.env` or `.env.local` to git repositories.
- Document all required keys in `.env.example`:
  ```
  PORT=5000
  NODE_ENV=production
  DATABASE_URL=mongodb+srv://...
  JWT_ACCESS_SECRET=your_jwt_secret
  JWT_REFRESH_SECRET=your_refresh_secret
  CLOUDINARY_CLOUD_NAME=...
  CLOUDINARY_API_KEY=...
  CLOUDINARY_API_SECRET=...
  SSLCOMMERZ_STORE_ID=...
  SSLCOMMERZ_STORE_PASSWORD=...
  SSLCOMMERZ_IS_LIVE=false
  NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1
  ```
