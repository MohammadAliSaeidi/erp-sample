export const LOCK_TTL_MS = 30_000;

export const LOCK_REFRESH_INTERVAL_MS = Math.floor(LOCK_TTL_MS * 0.6);

/** Refresh immediately when remaining TTL drops below this threshold. */
export const LOCK_LEAVE_THRESHOLD_MS = Math.floor(LOCK_TTL_MS * 0.3);
