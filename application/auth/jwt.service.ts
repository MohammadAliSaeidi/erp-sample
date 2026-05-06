import { jwtVerify, SignJWT } from "jose";
import { JwtPayload } from "@/features/auth/domain/types/jwt-payload.type";

export interface IJwtService {
  sign(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string>;
  verify(input: string): Promise<JwtPayload | null>;
}

export interface IJwtServiceBuilder {
  (secret: Uint8Array): IJwtService;
}

// Helper function to verify and cast the JWT payload
const verifyAndCast = async (
  input: string,
  secret: Uint8Array,
): Promise<JwtPayload | null> => {
  try {
    const { payload } = await jwtVerify(input, secret);
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
};

export const buildJwtService: IJwtServiceBuilder = (secret: Uint8Array) => ({
  sign: async (payload: Omit<JwtPayload, "iat" | "exp">): Promise<string> => {
    const signJWT = new SignJWT(payload as Record<string, unknown>)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d");

    return signJWT.sign(secret);
  },

  

  verify: async (input: string): Promise<JwtPayload | null> => {
    return verifyAndCast(input, secret);
  },
});
