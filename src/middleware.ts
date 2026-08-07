import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";
import {
  ADMIN_BASE_PATH,
  ADMIN_LOGIN_PATH,
  isAdminLoginPath,
  isAdminPath,
} from "@/constants/admin";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;
  const isAdmin = !!req.auth?.user?.isAdmin;

  const isAccountProtected =
    pathname.startsWith("/profile") || pathname.startsWith("/settings");

  const onAdminLogin = isAdminLoginPath(pathname);
  const isAdminProtected = isAdminPath(pathname) && !onAdminLogin;

  if (onAdminLogin && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL(ADMIN_BASE_PATH, req.nextUrl.origin));
  }

  if ((isAccountProtected || isAdminProtected) && !isLoggedIn) {
    const signInUrl = new URL(
      isAdminProtected ? ADMIN_LOGIN_PATH : "/sign-in",
      req.nextUrl.origin,
    );
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminProtected && isLoggedIn && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/settings/:path*",
    "/admin-145678",
    "/admin-145678/:path*",
  ],
};
