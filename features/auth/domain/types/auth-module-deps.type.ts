import { PrismaClient } from "@/app/generated/prisma/client";

export type AuthModuleDeps = {
  prismaClient: PrismaClient;
  jwtSecret: Uint8Array;
  cacheTtlMs?: number;
};