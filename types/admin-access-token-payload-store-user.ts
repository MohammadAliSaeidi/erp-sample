import { StoreUser } from "@/app/generated/prisma/client";

export type AdminAccessTokenPayloadStoreUser = Pick<
	StoreUser,
	"name" | "username" | "storeId"
>;
