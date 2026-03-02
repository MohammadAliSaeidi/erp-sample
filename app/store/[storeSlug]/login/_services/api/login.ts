import http from "@/lib/http";
import { LoginBody } from "@/lib/schema/auth";

export const login = async (body: LoginBody) =>
	await http.post<LoginBody>("/api/v1/auth/login", body);
