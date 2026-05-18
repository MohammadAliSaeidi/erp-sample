import { LockToken } from "@/src/application/shared/lock-service/lock-service.port";
import z from "zod";

async function loadGenerateLockToken(): Promise<{
  generateLockToken: () => LockToken;
}> {
  return import("@/src/application/shared/lock-service/generate-lock-token");
}

describe("generateLockToken", () => {
  afterEach(() => {
    jest.resetModules();
    jest.dontMock("crypto");
  });

  it("returns a non-empty branded lock token", async () => {
    const { generateLockToken } = await loadGenerateLockToken();
    const token = generateLockToken();

    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("generates unique tokens on successive calls", async () => {
    const { generateLockToken } = await loadGenerateLockToken();
    const tokens = new Set(
      Array.from({ length: 20 }, () => generateLockToken()),
    );

    expect(tokens.size).toBe(20);
  });

  it("produces UUID v4 strings when randomUUID is available", async () => {
    const { generateLockToken } = await loadGenerateLockToken();

    const { success } = z.uuidv4().safeParse(generateLockToken());

    expect(success).toBe(true);
  });

  it("uses randomUUID when exported from crypto", async () => {
    jest.doMock("crypto", () => ({
      randomUUID: () => "00000000-0000-4000-8000-000000000001",
      randomBytes: jest.fn(),
    }));

    const { generateLockToken } = await loadGenerateLockToken();

    expect(generateLockToken()).toBe("00000000-0000-4000-8000-000000000001");
  });

  it("falls back to randomBytes hex when randomUUID is unavailable", async () => {
    jest.doMock("crypto", () => ({
      randomBytes: (size: number) => Buffer.alloc(size, 0xab),
    }));

    const { generateLockToken } = await loadGenerateLockToken();

    expect(generateLockToken()).toBe("abababababababababababababababab");
  });
});
