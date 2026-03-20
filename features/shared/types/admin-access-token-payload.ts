import { TokenPayload } from "@/features/shared/lib/token";
import { AdminAccessTokenPayloadStoreUser } from "./admin-access-token-payload-store-user";
import { Prettify } from "./prettify.type";

export type AdminAccessTokenPayload = Prettify<
  TokenPayload &
    AdminAccessTokenPayloadStoreUser & {
      adminId: string;
      storeSlug: string;
      roleId: string;
    }
>;
