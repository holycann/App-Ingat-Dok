import jwt, { JwtPayload } from "jsonwebtoken";

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    return (decoded?.exp && decoded.exp < currentTime) as boolean;
  } catch (error) {
    return true;
  }
}

/**
 * Decode a JWT token without verification
 * @param token JWT token to decode
 * @returns Decoded token payload or null
 */
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error("Token decoding error:", error);
    return null;
  }
}
