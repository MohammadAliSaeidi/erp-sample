"use client";

import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { useAuthStore } from "../auth-store";
import { Permission } from "../../domain/types/permission.type";
import { usePermissions } from "../hooks/use-permissions";

// ─── Props ────────────────────────────────────────────────────────────────────

type ProtectedRouteProps = {
  permission: Permission | Permission[];
  children: ReactNode;
  // Where to send unauthenticated users (default: /login)
  loginPath?: string;
  // Where to send authenticated but unauthorized users (default: /unauthorized)
  unauthorizedPath?: string;
  // Custom fallback instead of redirect — useful for inline 403 pages
  fallback?: ReactNode;
};

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Page-level access control. Wraps an entire route or layout segment.
// Gate handles individual elements; ProtectedRoute handles entire pages.
//
// Usage (in a layout or page):
//   <ProtectedRoute permission="roles:read">
//     <RolesPage />
//   </ProtectedRoute>

export const ProtectedRoute = ({
  permission,
  children,
  loginPath = "/login",
  unauthorizedPath = "/unauthorized",
  fallback,
}: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { can } = usePermissions();

  if (!isAuthenticated) {
    redirect(loginPath);
  }

  if (!can(permission)) {
    if (fallback) return <>{fallback}</>;
    redirect(unauthorizedPath);
  }

  return <>{children}</>;
};
