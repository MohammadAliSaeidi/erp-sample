"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { acquireItemLockAction } from "@/src/interface/actions/item/acquire-item-lock.action";
import { refreshItemLockAction } from "@/src/interface/actions/item/refresh-item-lock.action";
import { releaseItemLockAction } from "@/src/interface/actions/item/release-item-lock.action";
import { useSocket } from "@/src/interface/ui/realtime/providers/socket-provider";
import {
  LOCK_REFRESH_INTERVAL_MS,
  LOCK_TTL_MS,
} from "@/src/interface/ui/realtime/constants/lock.constants";

export type ItemLockState =
  | { status: "idle" }
  | { status: "acquiring" }
  | { status: "locked"; lockToken: string; expiresAt: string }
  | { status: "blocked"; lockedBy: string; expiresAt: string }
  | { status: "error"; message: string };

type ItemLockedPayload = {
  storeId: string;
  itemId: string;
  lockedBy: string;
  expiresAt: string;
  token: string;
};

type ItemUnlockedPayload = {
  storeId: string;
  itemId: string;
  unlockedBy: string;
};

type ItemLockDeniedPayload = {
  storeId: string;
  itemId: string;
  requestedBy: string;
  lockedBy: string;
  expiresAt: string;
};

export function useItemEditLock(itemId: string) {
  const { socket, storeId, adminId, joinItem, leaveItem } = useSocket();
  const [lockState, setLockState] = useState<ItemLockState>({ status: "idle" });
  const lockTokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const releaseLock = useCallback(async () => {
    const lockToken = lockTokenRef.current;
    if (!lockToken) return;

    lockTokenRef.current = null;
    clearRefreshTimer();

    await releaseItemLockAction({ entityId: itemId, lockToken });
    setLockState({ status: "idle" });
  }, [clearRefreshTimer, itemId]);

  const refreshLock = useCallback(async () => {
    const lockToken = lockTokenRef.current;
    if (!lockToken) return;

    const result = await refreshItemLockAction({
      entityId: itemId,
      lockToken,
      ttlMs: LOCK_TTL_MS,
    });

    if (!result.ok || !result.data.ok) {
      lockTokenRef.current = null;
      clearRefreshTimer();
      setLockState({
        status: "blocked",
        lockedBy: "another user",
        expiresAt: new Date(Date.now() + LOCK_TTL_MS).toISOString(),
      });
      return;
    }

    const nextExpiresAt = new Date(Date.now() + LOCK_TTL_MS).toISOString();
    setLockState((current) =>
      current.status === "locked"
        ? { ...current, expiresAt: nextExpiresAt }
        : current,
    );
  }, [clearRefreshTimer, itemId]);

  const acquireLock = useCallback(async () => {
    if (!storeId) return;

    setLockState({ status: "acquiring" });
    joinItem(storeId, itemId);

    const result = await acquireItemLockAction({
      entityId: itemId,
      ttlMs: LOCK_TTL_MS,
    });

    if (!result.ok) {
      setLockState({ status: "error", message: result.error.message });
      return;
    }

    if (!result.data.ok) {
      setLockState({
        status: "blocked",
        lockedBy: result.data.lockedBy,
        expiresAt: result.data.expiresAt,
      });
      return;
    }

    lockTokenRef.current = result.data.lockToken;
    setLockState({
      status: "locked",
      lockToken: result.data.lockToken,
      expiresAt: result.data.expiresAt,
    });
  }, [itemId, joinItem, storeId]);

  useEffect(() => {
    if (!storeId) return;

    void acquireLock();

    return () => {
      void releaseLock();
      leaveItem(storeId, itemId);
    };
    // Acquire once per item page mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, storeId]);

  useEffect(() => {
    if (lockState.status !== "locked") return;

    refreshTimerRef.current = setInterval(() => {
      void refreshLock();
    }, LOCK_REFRESH_INTERVAL_MS);

    return () => {
      clearRefreshTimer();
    };
  }, [clearRefreshTimer, lockState.status, refreshLock]);

  useEffect(() => {
    if (!socket) return;

    const handleLocked = (payload: ItemLockedPayload) => {
      if (payload.itemId !== itemId) return;

      if (payload.lockedBy === adminId) {
        lockTokenRef.current = payload.token;
        setLockState({
          status: "locked",
          lockToken: payload.token,
          expiresAt: payload.expiresAt,
        });
        return;
      }

      setLockState({
        status: "blocked",
        lockedBy: payload.lockedBy,
        expiresAt: payload.expiresAt,
      });
    };

    const handleUnlocked = (payload: ItemUnlockedPayload) => {
      if (payload.itemId !== itemId) return;
      if (payload.unlockedBy === adminId) return;
      if (lockTokenRef.current) return;
      void acquireLock();
    };

    const handleDenied = (payload: ItemLockDeniedPayload) => {
      if (payload.itemId !== itemId) return;

      setLockState({
        status: "blocked",
        lockedBy: payload.lockedBy,
        expiresAt: payload.expiresAt,
      });
    };

    socket.on("item.locked", handleLocked);
    socket.on("item.unlocked", handleUnlocked);
    socket.on("item.lock.denied", handleDenied);

    return () => {
      socket.off("item.locked", handleLocked);
      socket.off("item.unlocked", handleUnlocked);
      socket.off("item.lock.denied", handleDenied);
    };
  }, [acquireLock, adminId, itemId, socket]);

  useEffect(() => {
    const handlePageHide = () => {
      void releaseLock();
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [releaseLock]);

  const canEdit = lockState.status === "locked";

  return {
    lockState,
    canEdit,
    acquireLock,
    releaseLock,
    refreshLock,
  };
}
