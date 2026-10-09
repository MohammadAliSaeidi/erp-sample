import { LoginStoreUserDTO } from "@/src/application/auth/usecase/login.usecase";
type StoreUser = LoginStoreUserDTO;

export const StoreUserRepositoryPort = {
  findStoreUserByStoreAndUsername: (storeId: string, username: string) =>
    Promise<StoreUser | null>,
};
