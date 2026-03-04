import { TokenPayload } from "@/lib/token";
import { Prettify } from "./prettify";
import { AdminAccessTokenPayloadStoreUser } from "./admin-access-token-payload-store-user";

export type AdminAccessTokenPayload = Prettify<
	TokenPayload & AdminAccessTokenPayloadStoreUser
>;
