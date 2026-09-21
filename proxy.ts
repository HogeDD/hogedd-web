import { NextResponse } from "next/server";
import { auth0 } from "@/app/_lib/auth0";

// proxyは、Auth0の認証RouteとセッションCookieを処理します。
export async function proxy(request: Request) {
  if (!auth0) {
    return NextResponse.next();
  }

  return auth0.middleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
