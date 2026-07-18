import { SignJWT, jwtVerify, type JWTPayload } from "jose-cjs";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "wayfarer-super-secret-key-2026"
);

export interface TokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const signToken = async (payload: TokenPayload): Promise<string> => {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
};

export const verifyToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
};
