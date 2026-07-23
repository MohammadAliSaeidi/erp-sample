"use server";

import { requireSsrAuth } from "@/features/auth";
import { resolveAdminAccessTokenCookieName } from "@/features/auth/domain/lib/resolve-admin-access-token-cookie-name";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";

export type WsSession = {
  token: string;
  storeId: string;
  adminId: string;
};

export async function getWsSessionAction(
  storeSlug?: string,
): Promise<ActionResult<WsSession>> {
  try {
    const authContext = await requireSsrAuth(
      storeSlug ? { storeSlug } : {},
    );

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieName = resolveAdminAccessTokenCookieName(
      storeSlug ? { storeSlug } : {},
      cookieStore.getAll().map((cookie) => cookie.name),
    );
    const token = cookieName
      ? (cookieStore.get(cookieName)?.value ?? null)
      : null;

    if (!token) {
      return mapUsecaseErrorToActionResult(
        new Error("Authentication required"),
      );
    }

    return actionSuccess({
      token,
      storeId: authContext.storeId,
      adminId: authContext.adminId,
    });
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
