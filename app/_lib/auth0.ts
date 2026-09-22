import "server-only";

import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { createAuth0ClientOptions } from "@/app/_lib/auth0-client-options";

const requiredEnvironmentVariables = [
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_CLIENT_SECRET",
  "AUTH0_SECRET",
] as const;

// auth0は、認証設定が揃った環境でRoute Handler・Server Component・proxyが共有するクライアントです。
export const auth0 = requiredEnvironmentVariables.every((name) => process.env[name])
  ? new Auth0Client(createAuth0ClientOptions(process.env.AUTH0_AUDIENCE))
  : null;
