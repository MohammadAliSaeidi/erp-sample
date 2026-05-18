import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { lockKeyRegex } from "../lock-service.types";

describe("lock key regex", () => {
  it("should detect lock key", () => {
    const storeId = uuid7GeneratorAdapter.generate();
    const itemId = uuid7GeneratorAdapter.generate();
    const lockKey = `store:${storeId}:item:${itemId}`;

    expect(lockKey).toMatch(lockKeyRegex);
  });
});