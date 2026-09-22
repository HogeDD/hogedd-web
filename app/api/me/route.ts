import { NextResponse } from "next/server";
import { auth0 } from "@/app/_lib/auth0";
import { fetchAuthenticatedIdentity } from "@/app/_lib/hogedd-api";

export const dynamic = "force-dynamic";

// GETは、Auth0 sessionをAccess Tokenへ変換しHogeDD APIの認証主体だけを返します。
export async function GET() {
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

  const result = await fetchAuthenticatedIdentity(apiBaseURL, accessToken);
  if (result.kind === "unauthorized") {
    return errorResponse(401, "unauthorized", "authentication required");
  }
  if (result.kind === "unavailable") {
    return errorResponse(502, "upstream_unavailable", "service temporarily unavailable");
  }

  return NextResponse.json(result.identity, {
    headers: { "Cache-Control": "no-store" },
  });
}

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
