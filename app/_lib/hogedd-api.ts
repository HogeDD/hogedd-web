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

type Fetch = typeof fetch;

const requestTimeoutMilliseconds = 5_000;

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

function isDateTime(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}
