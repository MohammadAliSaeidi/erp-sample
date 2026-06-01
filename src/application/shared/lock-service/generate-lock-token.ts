import { randomUUID, randomBytes } from "crypto";
import { LockToken } from "./lock-service.types";
import { brand } from "@/lib/brand";

export function generateLockToken(): LockToken {
  if (typeof randomUUID === "function") return brand(randomUUID());

  return brand(randomBytes(16).toString("hex"));
}
