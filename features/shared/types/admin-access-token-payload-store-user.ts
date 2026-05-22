import { StoreUser } from "@/src/infrastructure/database/orm/prisma/generated/client";

export type AdminAccessTokenPayloadStoreUser = Pick<
  StoreUser,
  "name" | "username" | "storeId"
>;
