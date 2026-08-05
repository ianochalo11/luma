import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const isAdmin = !!req.auth?.user?.isAdmin;

  const isAccountProtected =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings") ||
    /\/event\/[^/]+\/(register|checkout)/.test(pathname);

  const isAdminRoute = pathname.startsWith("/admin");

  if ((isAccountProtected || isAdminRoute) && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute && isLoggedIn && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/event/:path*/register",
    "/event/:path*/checkout",
    "/admin/:path*",
  ],
};
