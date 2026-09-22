import { describe, expect, it, vi } from "vitest";
import { registerAuthenticatedUser } from "@/app/_lib/hogedd-api";

const registeredUser = {
  id: "0199-user",
  email: "owner@example.com",
  email_verified: true,
  role: "member",
  status: "active",
  created_at: "2026-09-22T00:00:00Z",
  updated_at: "2026-09-22T00:00:00Z",
};

describe("HogeDD User registration API client", () => {
  it.each([200, 201] as const)("preserves successful status %s", async (status) => {
    const fetchImplementation = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json(registeredUser, { status }));

    const result = await registerAuthenticatedUser(
      "https://api.hogedd.com",
      "secret-access-token",
      fetchImplementation,
    );

    expect(result).toEqual({ kind: "ok", status, user: registeredUser });
    expect(fetchImplementation).toHaveBeenCalledWith(
      new URL("https://api.hogedd.com/v1/users/me"),
      expect.objectContaining({
        method: "PUT",
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
    [400, "unavailable"],
    [500, "unavailable"],
    [502, "unavailable"],
  ] as const)("maps API status %s to %s", async (status, kind) => {
    const result = await registerAuthenticatedUser(
      "https://api.hogedd.com",
      "token",
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status })),
    );

    expect(result).toEqual({ kind });
  });

  it("rejects a successful response with an unknown role", async () => {
    const result = await registerAuthenticatedUser(
      "https://api.hogedd.com",
      "token",
      vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({ ...registeredUser, role: "superuser" })),
    );

    expect(result).toEqual({ kind: "unavailable" });
  });

  it("maps network failures to unavailable", async () => {
    const result = await registerAuthenticatedUser(
      "https://api.hogedd.com",
      "token",
      vi.fn<typeof fetch>().mockRejectedValue(new Error("network failure")),
    );

    expect(result).toEqual({ kind: "unavailable" });
  });
});
