import { NextResponse } from "next/server";
import { auth0 } from "@/app/_lib/auth0";
import { registerAuthenticatedUser } from "@/app/_lib/hogedd-api";

export const dynamic = "force-dynamic";

// PUTは、Auth0 sessionの利用者をHogeDD Userとして冪等に登録します。
export async function PUT() {
  const apiBaseURL = process.env.HOGEDD_API_BASE_URL;
  if (!auth0 || !apiBaseURL) {
    return errorResponse(503, "service_unavailable", "service temporarily unavailable");
  }

  let accessToken: string;
  try {
    ({ token: accessToken } = await auth0.getAccessToken());
  } catch {
    return errorResponse(401, "unauthorized", "authentication required");
  }

  const result = await registerAuthenticatedUser(apiBaseURL, accessToken);
  if (result.kind === "unauthorized") {
    return errorResponse(401, "unauthorized", "authentication required");
  }
  if (result.kind === "unavailable") {
    return errorResponse(502, "upstream_unavailable", "service temporarily unavailable");
  }

  const headers: HeadersInit = { "Cache-Control": "no-store" };
  if (result.status === 201) {
    headers.Location = "/api/users/me";
  }
  return NextResponse.json(result.user, { status: result.status, headers });
}

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
