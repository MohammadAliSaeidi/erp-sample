import { LoginInput } from "@/features/auth/domain/types/login-body.type";
import { ApiClient } from "@/features/shared/lib/api-client";

export const login = async (body: LoginInput, apiClient: ApiClient) =>
  await apiClient.post<LoginInput>("/api/v1/auth/login", body);
