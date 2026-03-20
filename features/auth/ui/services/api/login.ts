import { LoginBody } from "@/features/auth/domain/types/login-body.type";
import { ApiClient } from "@/features/shared/lib/api-client";

export const login = async (body: LoginBody, apiClient: ApiClient) =>
  await apiClient.post<LoginBody>("/api/v1/auth/login", body);
