export type AuthenticatedIdentity = {
  issuer: string;
  subject: string;
};

export type IdentityAPIResult =
  | { kind: "ok"; identity: AuthenticatedIdentity }
  | { kind: "unauthorized" }
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
