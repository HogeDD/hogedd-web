export type AuthenticatedIdentity = {
  issuer: string;
  subject: string;
};

export type IdentityAPIResult =
  | { kind: "ok"; identity: AuthenticatedIdentity }
  | { kind: "unauthorized" }
  | { kind: "unavailable" };

export type RegisteredUser = {
  id: string;
  email: string;
  email_verified: boolean;
  role: "owner" | "admin" | "member";
  status: "active" | "disabled";
  created_at: string;
  updated_at: string;
};

export type UserRegistrationAPIResult =
  | { kind: "ok"; status: 200 | 201; user: RegisteredUser }
  | { kind: "unauthorized" }
  | { kind: "unavailable" };

export type CurrentUserAPIResult =
  | { kind: "ok"; user: RegisteredUser }
  | { kind: "unauthorized" }
  | { kind: "not_found" }
  | { kind: "unavailable" };

export type UserProfile = { display_name: string };

export type UserProfileAPIResult =
  | { kind: "ok"; profile: UserProfile }
  | { kind: "unauthorized" }
  | { kind: "user_not_found" }
  | { kind: "profile_not_found" }
  | { kind: "forbidden" }
  | { kind: "invalid" }
  | { kind: "unavailable" };

export type ManagementUser = {
  id: string;
  role: "owner" | "admin";
};

export type ManagementUserAPIResult =
  | { kind: "ok"; user: ManagementUser }
  | { kind: "not_found" }
  | { kind: "unavailable" };

export type ManagementApp = {
  slug: string;
  title: string;
  description: string;
  status: "preparing" | "published" | "private";
  tags: string[];
  version?: number;
  published_at?: string;
  development_drive?: string;
  youtube_url?: string;
};

export type ManagementAppAPIResult =
  | { kind: "ok"; app: ManagementApp & { version: number } }
  | { kind: "not_found" }
  | { kind: "conflict" }
  | { kind: "invalid" }
  | { kind: "unavailable" };

export type PublishManagementAppAPIResult = ManagementAppAPIResult;

export type ManagementAppsAPIResult =
  | { kind: "ok"; apps: ManagementApp[] }
  | { kind: "not_found" }
  | { kind: "unavailable" };

export type PublicApp = {
  slug: string;
  title: string;
  description: string;
  status: "published";
  published_at: string;
  tags: string[];
  development_drive: string;
  youtube_url: string;
};

export type PublicAppsAPIResult = { kind: "ok"; apps: PublicApp[] } | { kind: "unavailable" };

export type CreateManagementAppAPIResult =
  | { kind: "ok"; app: ManagementApp }
  | { kind: "not_found" }
  | { kind: "conflict" }
  | { kind: "invalid" }
  | { kind: "unavailable" };

type Fetch = typeof fetch;

const requestTimeoutMilliseconds = 5_000;

// fetchPublicAppsは、公開済みアプリをHogeDD APIから取得します。
export async function fetchPublicApps(
  baseURL: string,
  path = "/v1/apps",
  fetchImplementation: Fetch = fetch,
): Promise<PublicAppsAPIResult> {
  try {
    const response = await fetchImplementation(new URL(path, baseURL), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    });
    if (!response.ok) return { kind: "unavailable" };
    const body: unknown = await response.json();
    if (!isPublicAppsResponse(body)) return { kind: "unavailable" };
    return { kind: "ok", apps: body.data };
  } catch {
    return { kind: "unavailable" };
  }
}

// fetchAuthenticatedIdentityは、Access Tokenをサーバー間通信だけに使って認証主体を取得します。
export async function fetchAuthenticatedIdentity(
  baseURL: string,
  accessToken: string,
  fetchImplementation: Fetch = fetch,
): Promise<IdentityAPIResult> {
  try {
    const response = await fetchImplementation(new URL("/v1/me", baseURL), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    });

    if (response.status === 401) {
      return { kind: "unauthorized" };
    }
    if (!response.ok) {
      return { kind: "unavailable" };
    }

    const body: unknown = await response.json();
    if (!isAuthenticatedIdentity(body)) {
      return { kind: "unavailable" };
    }
    return { kind: "ok", identity: body };
  } catch {
    return { kind: "unavailable" };
  }
}

// registerAuthenticatedUserは、Access Tokenをサーバー間通信だけに使ってUserを冪等に登録します。
export async function registerAuthenticatedUser(
  baseURL: string,
  accessToken: string,
  fetchImplementation: Fetch = fetch,
): Promise<UserRegistrationAPIResult> {
  try {
    const response = await fetchImplementation(new URL("/v1/users/me", baseURL), {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    });

    if (response.status === 401) {
      return { kind: "unauthorized" };
    }
    if (response.status !== 200 && response.status !== 201) {
      return { kind: "unavailable" };
    }

    const body: unknown = await response.json();
    if (!isRegisteredUser(body)) {
      return { kind: "unavailable" };
    }
    return { kind: "ok", status: response.status, user: body };
  } catch {
    return { kind: "unavailable" };
  }
}

// fetchCurrentUserは、Access Tokenをサーバー間通信だけに使って登録済みUserを取得します。
export async function fetchCurrentUser(
  baseURL: string,
  accessToken: string,
  fetchImplementation: Fetch = fetch,
): Promise<CurrentUserAPIResult> {
  try {
    const response = await fetchImplementation(new URL("/v1/users/me", baseURL), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    });

    if (response.status === 401) return { kind: "unauthorized" };
    if (response.status === 404) return { kind: "not_found" };
    if (!response.ok) return { kind: "unavailable" };

    const body: unknown = await response.json();
    if (!isRegisteredUser(body)) return { kind: "unavailable" };
    return { kind: "ok", user: body };
  } catch {
    return { kind: "unavailable" };
  }
}

// fetchManagementUserは、Access Tokenをserver-sideだけで使って運営権限を確認します。
export async function fetchManagementUser(
  baseURL: string,
  accessToken: string,
  fetchImplementation: Fetch = fetch,
): Promise<ManagementUserAPIResult> {
  try {
    const response = await fetchImplementation(new URL("/v1/management/me", baseURL), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    });

    if (response.status === 404) return { kind: "not_found" };
    if (!response.ok) return { kind: "unavailable" };

    const body: unknown = await response.json();
    if (!isManagementUser(body)) return { kind: "unavailable" };
    return { kind: "ok", user: body };
  } catch {
    return { kind: "unavailable" };
  }
}

// fetchManagementAppsは、運営権限でdraftを含むApp一覧を取得します。
export async function fetchManagementApps(
  baseURL: string,
  accessToken: string,
  fetchImplementation: Fetch = fetch,
): Promise<ManagementAppsAPIResult> {
  try {
    const response = await managementAppsRequest(
      baseURL,
      accessToken,
      "GET",
      undefined,
      fetchImplementation,
    );
    if (response.status === 404) return { kind: "not_found" };
    if (!response.ok) return { kind: "unavailable" };
    const body: unknown = await response.json();
    if (!isManagementAppsResponse(body)) return { kind: "unavailable" };
    return { kind: "ok", apps: body.data };
  } catch {
    return { kind: "unavailable" };
  }
}

// createManagementAppは、運営権限で公開準備中Appを作成します。
export async function createManagementApp(
  baseURL: string,
  accessToken: string,
  input: { slug: string; title: string; description: string; tags: string[] },
  fetchImplementation: Fetch = fetch,
): Promise<CreateManagementAppAPIResult> {
  try {
    const response = await managementAppsRequest(
      baseURL,
      accessToken,
      "POST",
      JSON.stringify(input),
      fetchImplementation,
    );
    if (response.status === 404) return { kind: "not_found" };
    if (response.status === 409) return { kind: "conflict" };
    if (response.status === 400 || response.status === 422) return { kind: "invalid" };
    if (response.status !== 201) return { kind: "unavailable" };
    const body: unknown = await response.json();
    return isManagementApp(body) ? { kind: "ok", app: body } : { kind: "unavailable" };
  } catch {
    return { kind: "unavailable" };
  }
}

// fetchManagementAppは、運営権限でApp詳細と更新versionを取得します。
export async function fetchManagementApp(
  baseURL: string,
  accessToken: string,
  slug: string,
  fetchImplementation: Fetch = fetch,
): Promise<ManagementAppAPIResult> {
  return managementAppDetailRequest(
    baseURL,
    accessToken,
    slug,
    "GET",
    undefined,
    fetchImplementation,
  );
}

// updateManagementAppは、取得時versionを使って公開準備中Appを更新します。
export async function updateManagementApp(
  baseURL: string,
  accessToken: string,
  slug: string,
  input: {
    title: string;
    description: string;
    tags: string[];
    status: "private" | "published";
    development_drive: string;
    youtube_url: string;
    version: number;
  },
  fetchImplementation: Fetch = fetch,
): Promise<ManagementAppAPIResult> {
  return managementAppDetailRequest(
    baseURL,
    accessToken,
    slug,
    "PUT",
    JSON.stringify(input),
    fetchImplementation,
  );
}

// publishManagementAppは、公開条件を満たしたDraftを公開します。
export async function publishManagementApp(
  baseURL: string,
  accessToken: string,
  slug: string,
  input: {
    status?: "published" | "private";
    development_drive?: string;
    youtube_url?: string;
    version: number;
  },
  fetchImplementation: Fetch = fetch,
): Promise<PublishManagementAppAPIResult> {
  try {
    const response = await fetchImplementation(
      new URL(`/v1/management/apps/${encodeURIComponent(slug)}/publication`, baseURL),
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
        cache: "no-store",
        signal: AbortSignal.timeout(requestTimeoutMilliseconds),
      },
    );
    if (response.status === 404) return { kind: "not_found" };
    if (response.status === 409) return { kind: "conflict" };
    if (response.status === 400 || response.status === 422) return { kind: "invalid" };
    if (!response.ok) return { kind: "unavailable" };
    const value: unknown = await response.json();
    if (!isManagementApp(value) || !Number.isSafeInteger(value.version) || (value.version ?? 0) < 1)
      return { kind: "unavailable" };
    return { kind: "ok", app: value as ManagementApp & { version: number } };
  } catch {
    return { kind: "unavailable" };
  }
}

async function managementAppDetailRequest(
  baseURL: string,
  accessToken: string,
  slug: string,
  method: "GET" | "PUT",
  body: string | undefined,
  fetchImplementation: Fetch,
): Promise<ManagementAppAPIResult> {
  try {
    const response = await fetchImplementation(
      new URL(`/v1/management/apps/${encodeURIComponent(slug)}`, baseURL),
      {
        method,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(requestTimeoutMilliseconds),
      },
    );
    if (response.status === 404) return { kind: "not_found" };
    if (response.status === 409) return { kind: "conflict" };
    if (response.status === 400 || response.status === 422) return { kind: "invalid" };
    if (!response.ok) return { kind: "unavailable" };
    const value: unknown = await response.json();
    if (!isManagementApp(value) || !Number.isSafeInteger(value.version) || (value.version ?? 0) < 1)
      return { kind: "unavailable" };
    return { kind: "ok", app: value as ManagementApp & { version: number } };
  } catch {
    return { kind: "unavailable" };
  }
}

function managementAppsRequest(
  baseURL: string,
  accessToken: string,
  method: "GET" | "POST",
  body: string | undefined,
  fetchImplementation: Fetch,
) {
  return fetchImplementation(new URL("/v1/management/apps", baseURL), {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(requestTimeoutMilliseconds),
  });
}

// fetchCurrentUserProfileは、現在Userの本人編集プロフィールを取得します。
export async function fetchCurrentUserProfile(
  baseURL: string,
  accessToken: string,
  fetchImplementation: Fetch = fetch,
): Promise<UserProfileAPIResult> {
  return requestUserProfile(baseURL, accessToken, "GET", undefined, fetchImplementation);
}

// updateCurrentUserProfileは、現在Userの表示名を登録・更新します。
export async function updateCurrentUserProfile(
  baseURL: string,
  accessToken: string,
  displayName: string,
  fetchImplementation: Fetch = fetch,
): Promise<UserProfileAPIResult> {
  return requestUserProfile(
    baseURL,
    accessToken,
    "PUT",
    JSON.stringify({ display_name: displayName }),
    fetchImplementation,
  );
}

async function requestUserProfile(
  baseURL: string,
  accessToken: string,
  method: "GET" | "PUT",
  body: string | undefined,
  fetchImplementation: Fetch,
): Promise<UserProfileAPIResult> {
  try {
    const response = await fetchImplementation(new URL("/v1/users/me/profile", baseURL), {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(requestTimeoutMilliseconds),
    });
    if (response.status === 401) return { kind: "unauthorized" };
    if (response.status === 403) return { kind: "forbidden" };
    if (response.status === 422) return { kind: "invalid" };
    if (response.status === 404) {
      const code = await readErrorCode(response);
      return { kind: code === "profile_not_found" ? "profile_not_found" : "user_not_found" };
    }
    if (!response.ok) return { kind: "unavailable" };
    const value: unknown = await response.json();
    return isUserProfile(value) ? { kind: "ok", profile: value } : { kind: "unavailable" };
  } catch {
    return { kind: "unavailable" };
  }
}

async function readErrorCode(response: Response): Promise<string | undefined> {
  try {
    const value: unknown = await response.json();
    if (typeof value !== "object" || value === null) return undefined;
    const error = (value as Record<string, unknown>).error;
    if (typeof error !== "object" || error === null) return undefined;
    const code = (error as Record<string, unknown>).code;
    return typeof code === "string" ? code : undefined;
  } catch {
    return undefined;
  }
}

function isAuthenticatedIdentity(value: unknown): value is AuthenticatedIdentity {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const identity = value as Record<string, unknown>;
  return (
    typeof identity.issuer === "string" &&
    identity.issuer.length > 0 &&
    typeof identity.subject === "string" &&
    identity.subject.length > 0
  );
}

function isRegisteredUser(value: unknown): value is RegisteredUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    user.id.length > 0 &&
    typeof user.email === "string" &&
    user.email.length > 0 &&
    typeof user.email_verified === "boolean" &&
    (user.role === "owner" || user.role === "admin" || user.role === "member") &&
    (user.status === "active" || user.status === "disabled") &&
    isDateTime(user.created_at) &&
    isDateTime(user.updated_at)
  );
}

function isUserProfile(value: unknown): value is UserProfile {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).display_name === "string" &&
    ((value as Record<string, unknown>).display_name as string).length > 0
  );
}

function isManagementUser(value: unknown): value is ManagementUser {
  if (typeof value !== "object" || value === null) return false;
  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    user.id.length > 0 &&
    (user.role === "owner" || user.role === "admin")
  );
}

function isManagementAppsResponse(value: unknown): value is { data: ManagementApp[] } {
  if (typeof value !== "object" || value === null) return false;
  const data = (value as Record<string, unknown>).data;
  return Array.isArray(data) && data.every(isManagementApp);
}

function isPublicAppsResponse(value: unknown): value is { data: PublicApp[] } {
  if (typeof value !== "object" || value === null) return false;
  const data = (value as Record<string, unknown>).data;
  return (
    Array.isArray(data) &&
    data.every((app) => {
      if (typeof app !== "object" || app === null) return false;
      const value = app as Record<string, unknown>;
      return (
        typeof value.slug === "string" &&
        typeof value.title === "string" &&
        typeof value.description === "string" &&
        value.status === "published" &&
        typeof value.published_at === "string" &&
        Array.isArray(value.tags) &&
        value.tags.every((tag) => typeof tag === "string") &&
        typeof value.development_drive === "string" &&
        typeof value.youtube_url === "string"
      );
    })
  );
}

function isManagementApp(value: unknown): value is ManagementApp {
  if (typeof value !== "object" || value === null) return false;
  const app = value as Record<string, unknown>;
  return (
    typeof app.slug === "string" &&
    app.slug.length > 0 &&
    typeof app.title === "string" &&
    app.title.length > 0 &&
    typeof app.description === "string" &&
    app.description.length > 0 &&
    (app.status === "preparing" || app.status === "published" || app.status === "private") &&
    Array.isArray(app.tags) &&
    app.tags.every((tag) => typeof tag === "string") &&
    (app.version === undefined || (Number.isSafeInteger(app.version) && Number(app.version) > 0))
  );
}

function isDateTime(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}
