"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { acquireEditItemLockAction } from "@/src/interface/actions/item/acquire-edit-item-lock.action";
import { getWsAuthTokenAction } from "@/src/interface/actions/item/get-ws-auth-token.action";
import { refreshItemLockAction } from "@/src/interface/actions/item/refresh-item-lock.action";
import { releaseEditItemLockAction } from "@/src/interface/actions/item/release-edit-item-lock.action";
import {
  DEFAULT_ITEM_LOCK_TTL_MS,
} from "@/src/application/item/dto/item-lock.dto";
import {
  createInventorySocket,
  joinItemRoom,
  joinStoreRoom,
  leaveItemRoom,
  leaveStoreRoom,
  type ItemLockEventPayload,
} from "@/src/infrastructure/ws/inventory-socket.client";
import type { Socket } from "socket.io-client";

const LOCK_REFRESH_INTERVAL_MS = 30_000;

export type ItemEditLockState =
  | { status: "loading" }
  | { status: "editing"; lockToken: string; expiresAt: string }
  | {
      status: "locked-by-other";
      lockedBy: string;
      expiresAt: string;
    }
  | { status: "error"; message: string };

type UseItemEditLockParams = {
  storeId: string;
  itemId: string;
  storeSlug?: string;
};

export function useItemEditLock({
  storeId,
  itemId,
  storeSlug,
}: UseItemEditLockParams): ItemEditLockState {
  const [state, setState] = useState<ItemEditLockState>({ status: "loading" });
  const lockTokenRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const releaseHeldLock = useCallback(async () => {
    const token = lockTokenRef.current;
    if (!token) return;

    lockTokenRef.current = null;
    await releaseEditItemLockAction({ entityId: itemId, lockToken: token });
  }, [itemId]);

  useEffect(() => {
    let refreshTimer: ReturnType<typeof setInterval> | undefined;
    let cancelled = false;

    async function start() {
      const wsAuth = await getWsAuthTokenAction(storeSlug);
      if (cancelled) return;

      if (!wsAuth.ok) {
        setState({
          status: "error",
          message: wsAuth.error.message,
        });
        return;
      }

      const socket = createInventorySocket(wsAuth.data.token);
      socketRef.current = socket;
      joinStoreRoom(socket, storeId);
      joinItemRoom(socket, storeId, itemId);

      const onLocked = (payload: ItemLockEventPayload) => {
        if (payload.itemId !== itemId) return;
      };

      const onUnlocked = (payload: ItemLockEventPayload) => {
        if (payload.itemId !== itemId) return;
        setState((current) =>
          current.status === "locked-by-other"
            ? { status: "loading" }
            : current,
        );
      };

      const onDenied = (payload: ItemLockEventPayload) => {
        if (payload.itemId !== itemId) return;
        setState({
          status: "locked-by-other",
          lockedBy: payload.lockedBy ?? "another user",
          expiresAt: payload.expiresAt ?? "",
        });
      };

      socket.on("item.locked", onLocked);
      socket.on("item.unlocked", onUnlocked);
      socket.on("item.lock.denied", onDenied);

      const acquired = await acquireEditItemLockAction({
        entityId: itemId,
        ttlMs: DEFAULT_ITEM_LOCK_TTL_MS,
      });

      if (cancelled) return;

      if (!acquired.ok) {
        setState({
          status: "error",
          message: acquired.error.message,
        });
        return;
      }

      if (!acquired.data.ok) {
        setState({
          status: "locked-by-other",
          lockedBy: acquired.data.lockedBy,
          expiresAt: acquired.data.expiresAt,
        });
        return;
      }

      lockTokenRef.current = acquired.data.lockToken;
      setState({
        status: "editing",
        lockToken: acquired.data.lockToken,
        expiresAt: acquired.data.expiresAt,
      });

      refreshTimer = setInterval(async () => {
        const token = lockTokenRef.current;
        if (!token) return;

        await refreshItemLockAction({
          entityId: itemId,
          lockToken: token,
          ttlMs: DEFAULT_ITEM_LOCK_TTL_MS,
        });
      }, LOCK_REFRESH_INTERVAL_MS);
    }

    start().catch((error: unknown) => {
      if (cancelled) return;
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to acquire lock",
      });
    });

    return () => {
      cancelled = true;
      if (refreshTimer) clearInterval(refreshTimer);

      const socket = socketRef.current;
      if (socket) {
        leaveItemRoom(socket, storeId, itemId);
        leaveStoreRoom(socket, storeId);
        socket.removeAllListeners();
        socket.disconnect();
        socketRef.current = null;
      }

      void releaseHeldLock();
    };
  }, [itemId, releaseHeldLock, storeId, storeSlug]);

  return state;
}
