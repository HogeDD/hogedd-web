import "server-only";

import { Auth0Client } from "@auth0/nextjs-auth0/server";

const requiredEnvironmentVariables = [
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_SECRET",
] as const;

// auth0は、認証設定が揃った環境でRoute Handler・Server Component・proxyが共有するクライアントです。
export const auth0 = requiredEnvironmentVariables.every((name) => process.env[name])
  ? new Auth0Client({
      authorizationParameters: {
        audience: process.env.AUTH0_AUDIENCE,
        scope: "openid profile email offline_access",
      },
    })
  : null;
