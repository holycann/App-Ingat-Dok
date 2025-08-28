import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenExpired } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const logoutRedirectUrl = new URL(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/logout?redirect_url=${process.env.NEXT_PUBLIC_REDIRECT_AUTH_URL}`
  );

  // Validate token if not a public route
  if (!accessToken) {
    return NextResponse.redirect(logoutRedirectUrl);
  }

  try {
    // Verify token validity and expiration
    const isExpired = isTokenExpired(accessToken);

    if (isExpired) {
      return NextResponse.redirect(logoutRedirectUrl);
    }

    return NextResponse.next();
  } catch (error) {
    // Log the error (use a proper logging mechanism)
    console.error("Middleware authentication error:", error);

    return NextResponse.redirect(logoutRedirectUrl);
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|callback).*)"],
};
