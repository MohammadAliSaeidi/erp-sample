"use server";

import { getSsrAccessToken, requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";

export type WsAuthTokenDTO = {
  token: string;
};

export async function getWsAuthTokenAction(
  storeSlug?: string,
): Promise<ActionResult<WsAuthTokenDTO>> {
  try {
    await requireSsrAuth({ storeSlug });
    const token = await getSsrAccessToken({ storeSlug });

    if (!token) {
      return {
        ok: false,
        error: { code: "unauthorized", message: "Missing access token" },
      };
    }

    return actionSuccess({ token });
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
