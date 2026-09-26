import { describe, expect, it, vi } from "vitest";
import {
  createManagementApp,
  fetchManagementApp,
  fetchManagementApps,
  fetchManagementUser,
  publishManagementApp,
  updateManagementApp,
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

describe("Management App detail API client", () => {
  const app = {
    slug: "draft",
    title: "Draft",
    description: "Description",
    status: "preparing" as const,
    tags: ["Go"],
    version: 2,
  };

  it("gets a versioned app detail", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(Response.json(app));
    await expect(
      fetchManagementApp("https://api.hogedd.com", "token", "draft", request),
    ).resolves.toEqual({ kind: "ok", app });
    expect(request).toHaveBeenCalledWith(
      new URL("https://api.hogedd.com/v1/management/apps/draft"),
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("updates with the fetched version and maps conflicts", async () => {
    const success = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ ...app, title: "Updated", version: 3 }));
    const result = await updateManagementApp(
      "https://api.hogedd.com",
      "token",
      "draft",
      { title: "Updated", description: "Description", tags: ["Go"], version: 2 },
      success,
    );
    expect(result.kind).toBe("ok");
    expect(success).toHaveBeenCalledWith(
      expect.any(URL),
      expect.objectContaining({ method: "PUT", body: expect.stringContaining('"version":2') }),
    );
    await expect(
      updateManagementApp(
        "https://api.hogedd.com",
        "token",
        "draft",
        { title: "Updated", description: "Description", tags: [], version: 2 },
        vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 409 })),
      ),
    ).resolves.toEqual({ kind: "conflict" });
  });

  it("publishes with the current version", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        ...app,
        version: 3,
        published_at: "2026-09-26T10:00:00Z",
        development_drive: "学習DD",
        youtube_url: "https://youtu.be/video",
      }),
    );
    const result = await publishManagementApp(
      "https://api.hogedd.com",
      "token",
      "draft",
      { development_drive: "学習DD", youtube_url: "https://youtu.be/video", version: 2 },
      request,
    );
    expect(result.kind).toBe("ok");
    expect(request).toHaveBeenCalledWith(
      new URL("https://api.hogedd.com/v1/management/apps/draft/publication"),
      expect.objectContaining({ method: "PUT" }),
    );
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
