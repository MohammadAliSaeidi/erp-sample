import { jwtVerify, SignJWT } from "jose";
import { NextRequest } from "next/server";
import { JwtPayload } from "../types/jwt-payload.type";

export interface IJwtService {
	extractFromRequest(
		req: NextRequest,
		cookieName?: string,
	): Promise<JwtPayload | null>;
	sign(payload: Omit<JwtPayload, "iat" | "exp">): Promise<string>;
	verify(input: string): Promise<JwtPayload | null>;
}

export interface IJwtServiceBuilder {
	(secret: Uint8Array): IJwtService;
}

const DEFAULT_COOKIE_NAME = "auth_token";

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
	sign: async (
		payload: Omit<JwtPayload, "iat" | "exp">,
	): Promise<string> => {
		const signJWT = new SignJWT(payload as Record<string, unknown>)
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("7d");

		return signJWT.sign(secret);
	},

	extractFromRequest: async (
		req: NextRequest,
		cookieName: string = DEFAULT_COOKIE_NAME,
	): Promise<JwtPayload | null> => {
		const token = req.cookies.get(cookieName)?.value;
		if (!token) return null;
		return verifyAndCast(token, secret);
	},

	verify: async (input: string): Promise<JwtPayload | null> => {
		return verifyAndCast(input, secret);
	},
});
