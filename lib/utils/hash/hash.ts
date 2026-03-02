import bcrypt from "bcrypt";

const ROUNDED_SALTS = 12;
const BCRYPT_HASH_PREFIX = "$2";

/**
 * Ensures the provided value is a string.
 * @throws TypeError when the value is not a string.
 */
function assertString(value: unknown, name: string): asserts value is string {
	if (typeof value !== "string") {
		throw new TypeError(`${name} must be a string`);
	}
}

/**
 * Hashes the provided plaintext using bcrypt.
 * @param input - The plain text value to encrypt.
 * @returns The bcrypt hash string.
 * @throws TypeError when `input` is not a string.
 * @throws Error when bcrypt fails.
 */
export async function hash(input: string): Promise<string> {
	assertString(input, "input");

	try {
		return await bcrypt.hash(input, ROUNDED_SALTS);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to hash input: ${message}`);
	}
}

/**
 * Verifies a plaintext value against a bcrypt hash.
 * @param data - The plain text value to verify.
 * @param encrypted - The bcrypt hash to compare against.
 * @returns `true` when the values match, `false` otherwise.
 * @throws TypeError when either argument is not a string.
 * @throws Error when the hash does not look like bcrypt output or bcrypt.compare fails.
 */
export async function isHashMatch(
	data: string,
	encrypted: string,
): Promise<boolean> {
	assertString(data, "data");
	assertString(encrypted, "encrypted");

	if (!encrypted.startsWith(BCRYPT_HASH_PREFIX)) {
		throw new Error("Encrypted value does not look like a bcrypt hash");
	}

	try {
		return await bcrypt.compare(data, encrypted);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to compare hash: ${message}`);
	}
}
