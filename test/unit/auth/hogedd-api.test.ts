import { describe, expect, it, vi } from "vitest";
import { fetchAuthenticatedIdentity } from "@/app/_lib/hogedd-api";

describe("HogeDD API client", () => {
  it("sends the access token only in the server-to-server Authorization header", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        issuer: "https://hogedd.jp.auth0.com/",
        subject: "auth0|owner",
      }),
    );

    const result = await fetchAuthenticatedIdentity(
      "https://api.hogedd.com",
      "secret-access-token",
      fetchImplementation,
    );

    expect(result).toEqual({
      kind: "ok",
      identity: {
        issuer: "https://hogedd.jp.auth0.com/",
        subject: "auth0|owner",
      },
    });
    expect(fetchImplementation).toHaveBeenCalledWith(
      new URL("https://api.hogedd.com/v1/me"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer secret-access-token",
        }),
        cache: "no-store",
      }),
    );
    expect(JSON.stringify(result)).not.toContain("secret-access-token");
  });

  it.each([
    [401, "unauthorized"],
    [500, "unavailable"],
  ] as const)("maps API status %s to %s", async (status, kind) => {
    const result = await fetchAuthenticatedIdentity(
      "https://api.hogedd.com",
      "token",
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status })),
    );

    expect(result).toEqual({ kind });
  });

  it("rejects an unexpected successful response", async () => {
    const result = await fetchAuthenticatedIdentity(
      "https://api.hogedd.com",
      "token",
      vi.fn<typeof fetch>().mockResolvedValue(Response.json({ user: "owner" })),
    );

    expect(result).toEqual({ kind: "unavailable" });
  });

  it("maps network failures to unavailable", async () => {
    const result = await fetchAuthenticatedIdentity(
      "https://api.hogedd.com",
      "token",
      vi.fn<typeof fetch>().mockRejectedValue(new Error("network failure")),
    );

    expect(result).toEqual({ kind: "unavailable" });
  });
});
