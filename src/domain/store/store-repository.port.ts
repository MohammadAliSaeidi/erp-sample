import { LoginStoreDTO } from "@/src/application/auth/usecase/login.usecase";

export type StoreRepositoryPort = {
  findStoreBySlug: (storeSlug: string) => Promise<LoginStoreDTO | null>;
};
