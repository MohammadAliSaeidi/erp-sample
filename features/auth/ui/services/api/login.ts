import { LoginBody } from "@/features/auth/domain/types/login-body.type";
import { AxiosInstance } from "axios";

export const login = async (http: AxiosInstance, body: LoginBody) =>
     await http.post<LoginBody>("/api/v1/auth/login", body);
