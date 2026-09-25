import { describe, expect, it, vi } from "vitest";
import { fetchManagementUser } from "@/app/_lib/hogedd-api";

describe("Management API client", () => {
  it("keeps the access token in the server-to-server request", async () => {
    const fetchImplementation = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ id: "user-1", role: "owner" }));

    const result = await fetchManagementUser(
      "https://api.hogedd.com",
      "secret-access-token",
      fetchImplementation,
    );

    expect(result).toEqual({ kind: "ok", user: { id: "user-1", role: "owner" } });
    expect(fetchImplementation).toHaveBeenCalledWith(
      new URL("https://api.hogedd.com/v1/management/me"),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer secret-access-token" }),
        cache: "no-store",
      }),
    );
    expect(JSON.stringify(result)).not.toContain("secret-access-token");
  });

  it.each([
    [404, "not_found"],
    [500, "unavailable"],
  ] as const)("maps API status %s to %s", async (status, kind) => {
    const result = await fetchManagementUser(
      "https://api.hogedd.com",
      "token",
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status })),
    );

    expect(result).toEqual({ kind });
  });

  it("rejects member data in a successful response", async () => {
    const result = await fetchManagementUser(
      "https://api.hogedd.com",
      "token",
      vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: "user-1", role: "member" })),
    );

    expect(result).toEqual({ kind: "unavailable" });
  });
});
