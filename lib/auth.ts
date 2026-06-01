export type AppRole = "user" | "admin-web" | "admin-resto";

export type ApprovalStatus = "approved" | "pending";

export const ROLE_COOKIE_NAME = "manganrek-role";

export const ROLE_APPROVAL_COOKIE_NAME = "manganrek-role-status";

export const roleDashboardPaths: Record<AppRole, string> = {
  user: "/",
  "admin-web": "/dashboard/admin-web",
  "admin-resto": "/dashboard/admin-resto",
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
  return value === "user" || value === "admin-web" || value === "admin-resto";
}

export function normalizeRole(value: string | null | undefined): AppRole | null {
  if (!value) return null;
  if (isAppRole(value)) return value;
  return null;
}

export function normalizeApprovalStatus(
  value: string | null | undefined
): ApprovalStatus | null {
  if (value === "approved" || value === "pending") return value;
  return null;
}

export function getDashboardPath(role: AppRole) {
  return roleDashboardPaths[role];
}

export function getAuthRedirectPath(role: AppRole) {
  return role === "user" ? "/" : roleDashboardPaths[role];
}
