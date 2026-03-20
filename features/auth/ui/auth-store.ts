import { Prettify } from "@/features/shared/types/prettify.type";
import { create, StoreApi, UseBoundStore } from "zustand";
import { Permission } from "../domain/types/permission.type";

export type AuthState = {
  adminId: string | null;
  storeId: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
};

export type AuthActions = {
  setAuth: (
    auth: Prettify<Pick<AuthState, "adminId" | "storeId" | "permissions">>,
  ) => void;
  clearAuth: () => void;
};

/**
 * Default unauthenticated state
 * @type {AuthState}
 * @readonly
 */
export const initialState: AuthState = {
  adminId: null,
  storeId: null,
  permissions: [],
  isAuthenticated: false,
};

/**
 * Authentication State Store (Zustand)
 *
 * Central client-side state management for authentication session data. This is the
 * **single source of truth** for "what can the current user do?" on the frontend.
 * All authorization gates and hooks must read from this store.
 *
 * @module lib/auth-store
 * @example
 * import { useAuthStore } from "@/lib/auth-store"
 *
 * // Subscribe to changes in a component
 * const permissions = useAuthStore(state => state.permissions)
 * const isAuthenticated = useAuthStore(state => state.isAuthenticated)
 *
 * // Set auth after login response
 * useAuthStore.getState().setAuth({ adminId, storeId, permissions })
 */
export const useAuthStore: UseBoundStore<StoreApi<AuthState & AuthActions>> =
  create<AuthState & AuthActions>((set) => ({
    ...initialState,

    setAuth: ({ adminId, storeId, permissions }) =>
      set({ adminId, storeId, permissions, isAuthenticated: true }),

    clearAuth: () => set(initialState),
  }));
