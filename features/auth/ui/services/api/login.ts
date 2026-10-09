import { ApiClient } from "@/lib/api-client";
import { LoginInputDTO } from "@/src/application/auth/usecase/login-input-dto.type";

export const login = async (body: LoginInputDTO, apiClient: ApiClient) =>
	await apiClient.post<LoginInputDTO>("/api/v1/auth/login", body);
