import { NextRequest } from "next/server";
import { getTokenFromHeader, verifyToken, JWTPayload } from "./jwt";

export async function authenticateRequest(
  request: NextRequest,
  requiredType?: "company" | "admin"
): Promise<{ authenticated: true; user: JWTPayload } | { authenticated: false; error: string }> {
  const authHeader = request.headers.get("authorization");
  const token = getTokenFromHeader(authHeader);

  if (!token) {
    return { authenticated: false, error: "No token provided" };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { authenticated: false, error: "Invalid or expired token" };
  }

  if (requiredType && payload.type !== requiredType) {
    return { authenticated: false, error: "Unauthorized" };
  }

  return { authenticated: true, user: payload };
}
