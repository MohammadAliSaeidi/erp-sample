import { Brand } from "@/lib/brand";
import z from "zod";

/**
 * - [x] with capture group
 *
 * **Security Warning**: this is the pattern without "$" and "^":
 *
 * /([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})/
 */
export const uuidV7Pattern: RegExp =
	/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})/;

export const uuidV7Regex = new RegExp(`^${uuidV7Pattern.source}$`);

export const lockKeyRegex = new RegExp(
	`^store:${uuidV7Pattern.source}:item:${uuidV7Pattern.source}$`,
);

export const lockKeySchema = z.string().regex(lockKeyRegex).brand("LockKey");

export type LockKey = Brand<string, "LockKey">;

export const lockTokenSchema = z.string().brand("LockToken");

export type LockToken = z.infer<typeof lockTokenSchema>;

export type LockResultOk = {
	ok: true;
	lockedBy: string;
	expiresAt: string;
	lockToken: LockToken;
};

export type LockResultFailure = {
	ok: false;
	lockedBy: string;
	expiresAt: string;
};

/** Lock acquisition result. */
export type LockResult = LockResultOk | LockResultFailure;

export type UnlockResultOk = { ok: true };

export type UnlockResultFailure = { ok: false };

export type UnlockResult = UnlockResultOk | UnlockResultFailure;
