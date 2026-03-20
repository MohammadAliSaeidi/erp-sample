export type JwtPayload = {
  adminId: string;
  storeId: string;
  storeSlug: string;
  username: string;
  roleId: string;
  iat: number;
  exp: number;
};
