import type { Auth0Client } from "@auth0/nextjs-auth0/server";

type Auth0ClientOptions = NonNullable<ConstructorParameters<typeof Auth0Client>[0]>;

// createAuth0ClientOptionsは、Tokenをブラウザへ公開しないBFF向けAuth0設定を返します。
export function createAuth0ClientOptions(audience: string | undefined): Auth0ClientOptions {
  return {
    enableAccessTokenEndpoint: false,
    authorizationParameters: {
      audience,
      scope: "openid profile email offline_access",
    },
  };
}
