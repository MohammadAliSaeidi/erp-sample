export type JwtPayload = {
	adminId: string;
	storeId: string;
	roleId: string;
	iat: number;
	exp: number;
};
