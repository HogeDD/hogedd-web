import { describe, expect, it, vi } from "vitest";
import {
  createManagementApp,
  fetchManagementApps,
  fetchManagementUser,
} from "@/app/_lib/hogedd-api";

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

describe("Management Apps API client", () => {
  it("lists validated management apps", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        data: [
          {
            slug: "draft",
            title: "Draft",
            description: "Description",
            status: "preparing",
            tags: [],
          },
        ],
      }),
    );
    const result = await fetchManagementApps(
      "https://api.hogedd.com",
      "token",
      fetchImplementation,
    );
    expect(result).toEqual({
      kind: "ok",
      apps: [
        {
          slug: "draft",
          title: "Draft",
          description: "Description",
          status: "preparing",
          tags: [],
        },
      ],
    });
    expect(fetchImplementation).toHaveBeenCalledWith(
      new URL("https://api.hogedd.com/v1/management/apps"),
      expect.objectContaining({ method: "GET", cache: "no-store" }),
    );
  });

  it.each([
    [404, "not_found"],
    [500, "unavailable"],
  ] as const)("maps list status %s to %s", async (status, kind) => {
    const result = await fetchManagementApps(
      "https://api.hogedd.com",
      "token",
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status })),
    );
    expect(result).toEqual({ kind });
  });

  it("creates a draft without exposing its token", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json(
        {
          slug: "new-app",
          title: "New",
          description: "Description",
          status: "preparing",
          tags: ["Game"],
        },
        { status: 201 },
      ),
    );
    const result = await createManagementApp(
      "https://api.hogedd.com",
      "secret-token",
      { slug: "new-app", title: "New", description: "Description", tags: ["Game"] },
      fetchImplementation,
    );
    expect(result.kind).toBe("ok");
    expect(JSON.stringify(result)).not.toContain("secret-token");
    expect(fetchImplementation).toHaveBeenCalledWith(
      new URL("https://api.hogedd.com/v1/management/apps"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          slug: "new-app",
          title: "New",
          description: "Description",
          tags: ["Game"],
        }),
      }),
    );
  });

  it.each([
    [404, "not_found"],
    [409, "conflict"],
    [422, "invalid"],
    [500, "unavailable"],
  ] as const)("maps create status %s to %s", async (status, kind) => {
    const result = await createManagementApp(
      "https://api.hogedd.com",
      "token",
      { slug: "new-app", title: "New", description: "Description", tags: [] },
      vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status })),
    );
    expect(result).toEqual({ kind });
  });
});
