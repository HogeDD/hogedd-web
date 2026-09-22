import { describe, expect, it } from "vitest";
import { createAuth0ClientOptions } from "@/app/_lib/auth0-client-options";

describe("Auth0 client options", () => {
  it("keeps access tokens on the server side", () => {
    const options = createAuth0ClientOptions("https://api.hogedd.com");

    expect(options.enableAccessTokenEndpoint).toBe(false);
    expect(options.authorizationParameters).toMatchObject({
      audience: "https://api.hogedd.com",
      scope: "openid profile email offline_access",
    });
  });
});
