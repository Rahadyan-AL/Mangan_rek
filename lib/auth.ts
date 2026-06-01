export type AppRole = "user" | "admin-web" | "admin-resto" | "kasir";

export type ApprovalStatus = "approved" | "pending";

export const ROLE_COOKIE_NAME = "manganrek-role";

export const ROLE_APPROVAL_COOKIE_NAME = "manganrek-role-status";

export const roleDashboardPaths: Record<AppRole, string> = {
  user: "/",
  "admin-web": "/dashboard/admin-web",
  "admin-resto": "/dashboard/admin-resto",
  "kasir": "/dashboard/kasir",
};

export const protectedDashboardPrefixes = [
  "/dashboard/admin-web",
  "/dashboard/admin-resto",
] as const;

export const authPagePrefixes = [
  "/login",
  "/register/user",
  "/register/resto",
  "/logout",
] as const;

export function isAppRole(value: string | undefined | null): value is AppRole {
  if (!value) return false;
  const v = value.toUpperCase();
  return v === "USER" || v === "SUPER_ADMIN" || v === "ADMIN_RESTO" || v === "KASIR" ||
         value === "user" || value === "admin-web" || value === "admin-resto" || value === "kasir";
}

export function normalizeRole(value: string | null | undefined): AppRole | null {
  if (!value) return null;
  
  const v = value.toUpperCase();
  if (v === "USER") return "user";
  if (v === "SUPER_ADMIN" || v === "ADMIN_WEB" || v === "ADMIN-WEB") return "admin-web";
  if (v === "ADMIN_RESTO" || v === "ADMIN-RESTO") return "admin-resto";
  if (v === "KASIR") return "kasir";

  const lower = value.toLowerCase();
  if (lower === "user" || lower === "admin-web" || lower === "admin-resto" || lower === "kasir") {
    return lower as AppRole;
  }
  return null;
}

export function normalizeApprovalStatus(
  value: string | null | undefined
): ApprovalStatus | null {
  if (!value) return null;
  const v = value.toUpperCase();
  if (v === "ACTIVE" || v === "APPROVED") return "approved";
  if (v === "PENDING") return "pending";
  if (value === "approved" || value === "pending") return value;
  return null;
}

export function getDashboardPath(role: AppRole) {
  return roleDashboardPaths[role];
}

export function getAuthRedirectPath(role: AppRole) {
  return role === "user" ? "/" : roleDashboardPaths[role];
}
