import "server-only";

import { Auth0Client } from "@auth0/nextjs-auth0/server";

// auth0は、Route Handler・Server Component・proxyで共有するAuth0クライアントです。
export const auth0 = new Auth0Client({
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email offline_access",
  },
});
