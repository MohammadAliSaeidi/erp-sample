import { JwtPayload } from "@/features/auth/domain/types/jwt-payload.type";
import { NextRequest } from "next/server";

export const extractTokenFromRequest = async (
  req: NextRequest,
  cookieName: string,
): Promise<JwtPayload | null> => {
  const token = req.cookies.get(cookieName)?.value;
  if (!token) return null;
  return verifyAndCast(token, secret);
};
