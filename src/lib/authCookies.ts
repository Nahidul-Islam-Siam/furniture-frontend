/**
 * Edge & Browser compatible JWT payload parser and auth cookie utilities.
 * Ensures stale, malformed, demo, or expired tokens cannot grant access to protected routes.
 */

export interface JwtPayload {
  userId?: string;
  id?: string;
  _id?: string;
  role?: string;
  email?: string;
  exp?: number;
  iat?: number;
}

export function parseJwtPayload(token?: string | null): JwtPayload | null {
  if (!token || typeof token !== "string") return null;

  // Reject any legacy demo tokens or obvious non-JWT strings
  const trimmed = token.trim();
  if (trimmed.startsWith("demo_token_")) return null;

  const parts = trimmed.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (base64.length % 4)) % 4;
    const padded = base64 + "=".repeat(padLength);
    const jsonString = decodeURIComponent(
      Array.prototype.map
        .call(atob(padded), (c: string) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const payload = JSON.parse(jsonString) as JwtPayload;
    if (!payload || typeof payload !== "object") return null;
    return payload;
  } catch {
    return null;
  }
}

export function isJwtTokenValid(token?: string | null): boolean {
  const payload = parseJwtPayload(token);
  if (!payload) return false;

  // Must carry user identity or role claim
  if (!payload.userId && !payload.id && !payload._id && !payload.role && !payload.email) {
    return false;
  }

  // Reject expired tokens if exp claim is present
  if (typeof payload.exp === "number") {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp <= nowSeconds) {
      return false;
    }
  }

  return true;
}

export function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function clearAuthCookies(): void {
  if (typeof document === "undefined") return;
  const expired = "Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";
  document.cookie = `accessToken=; ${expired}`;
  document.cookie = `token=; ${expired}`;
  document.cookie = `role=; ${expired}`;
}

export function isAdminRole(role?: string | null): boolean {
  const normalized = (role || "").trim().toUpperCase();
  return normalized === "ADMIN" || normalized === "SUPER_ADMIN";
}

export function normalizeRoleString(
  role?: string | null
): "SUPER_ADMIN" | "ADMIN" | "USER" {
  const normalized = (role || "").trim().toUpperCase();
  if (normalized === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (normalized === "ADMIN") return "ADMIN";
  return "USER";
}

export function getHomeRouteForRole(role?: string | null): "/admin" | "/dashboard" {
  return isAdminRole(role) ? "/admin" : "/dashboard";
}
