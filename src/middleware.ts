import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login");

  if (isOnLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // هذا الـ matcher يطبق الحماية على كل الصفحات ما عدا مسارات api والملفات الثابتة
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox|swe-worker).*)"],
};