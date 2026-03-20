import bcrypt from "bcrypt";
import { hash, isHashMatch } from "./hash";

afterEach(() => {
  jest.restoreAllMocks();
});

test("hashing and verifying encrypted password with correct password", async () => {
  const PASSWORD = "1234";
  const encryptedPassword = await hash(PASSWORD);
  const isPasswordCorrect = await isHashMatch(PASSWORD, encryptedPassword);

  expect(isPasswordCorrect).toBe(true);
});

test("hashing and verifying encrypted password with wrong password", async () => {
  const PASSWORD = "1234";
  const encryptedPassword = await hash(PASSWORD);
  const inputPassword = "12345";
  const isPasswordCorrect = await isHashMatch(inputPassword, encryptedPassword);

  expect(isPasswordCorrect).toBe(false);
});

test("hash produces salted digests while still matching", async () => {
  const PASSWORD = "salting";
  const firstDigest = await hash(PASSWORD);
  const secondDigest = await hash(PASSWORD);

  expect(firstDigest).not.toEqual(secondDigest);
  await expect(isHashMatch(PASSWORD, firstDigest)).resolves.toBe(true);
  await expect(isHashMatch(PASSWORD, secondDigest)).resolves.toBe(true);
});

test("hash rejects non-string input", async () => {
  // @ts-expect-error purposefully passing an invalid argument
  await expect(hash(null)).rejects.toThrow("input must be a string");
});

test("hash surfaces bcrypt failures", async () => {
  const spy = jest
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .spyOn(bcrypt, "hash" as any)
    .mockRejectedValueOnce(new Error("boom"));

  await expect(hash("any")).rejects.toThrow("Failed to hash input: boom");
  expect(spy).toHaveBeenCalled();
});

test("isHashMatch rejects non-string data/encrypted values", async () => {
  await expect(
    // @ts-expect-error purposefully passing an invalid argument
    isHashMatch(123, "$2b$10$abcdefghijklmnopqrstuv"),
  ).rejects.toThrow("data must be a string");

  // @ts-expect-error purposefully passing an invalid argument
  await expect(isHashMatch("plain", 123)).rejects.toThrow(
    "encrypted must be a string",
  );
});

test("isHashMatch rejects hashes without bcrypt prefix", async () => {
  await expect(isHashMatch("plain", "invalid-hash")).resolves.toBe(false);
});

test("isHashMatch surfaces bcrypt compare failures", async () => {
  const hashString = "$2b$10$abcdefghijklmnopqrstuv";
  const spy = jest
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .spyOn(bcrypt, "compare" as any)
    .mockRejectedValueOnce(new Error("boom"));

  await expect(isHashMatch("plain", hashString)).resolves.toBe(false);
  expect(spy).toHaveBeenCalledWith("plain", hashString);
});
