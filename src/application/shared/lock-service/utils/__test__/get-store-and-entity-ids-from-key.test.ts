import { brand } from "@/lib/brand";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { LockKeys } from "../../lock-service.registry";
import { getStoreAndEntityIdsFromKey } from "../get-store-and-entity-ids-from-key";
import { LockKey } from "../../lock-service.types";

/**
 * Tests for getStoreAndEntityIdsFromKey
 *
 * Ensures the function correctly extracts storeId and entityId
 * from a valid lock key and properly handles invalid keys.
 */
describe("getStoreAndEntityIdsFromKey", () => {
	/**
	 * Should extract storeId and entityId from a valid lock key.
	 */
	it("extracts ids from a valid lock key", () => {
		const storeId = uuid7GeneratorAdapter.generate();
		const entityId = uuid7GeneratorAdapter.generate();

		const key = LockKeys.item(brand(storeId), brand(entityId));

		const result = getStoreAndEntityIdsFromKey(key);

		expect(result).toEqual({
			storeId,
			entityId,
		});
	});

	/**
	 * Should return fallback values when key does not match the regex.
	 */
	it("returns fallback values for invalid keys", () => {
		const key = "invalid:key";

		const result = getStoreAndEntityIdsFromKey(key as LockKey);

		expect(result).toEqual({
			storeId: "unknown-store",
			entityId: key,
		});
	});
});
