import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If there's no session, redirect to /login for protected routes
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user exists but is not an admin, prevent access to /admin
  const role = (session as any)?.user?.role;
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls
  matcher: ["/admin/:path*", "/dashboard/:path*"], // routes the middleware applies to
};
