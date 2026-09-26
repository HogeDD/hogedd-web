import { createHmac, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const visitorCookieName = "hogedd_visitor_id";

export async function POST(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const apiBaseURL = process.env.HOGEDD_API_BASE_URL;
  const ingestToken = process.env.METRICS_INGEST_TOKEN;
  const visitorSecret = process.env.ANONYMOUS_VISITOR_SECRET;
  if (!apiBaseURL || !ingestToken || !visitorSecret) return new NextResponse(null, { status: 204 });
  const cookieStore = await cookies();
  const existingVisitorID = cookieStore.get(visitorCookieName)?.value;
  const visitorID = existingVisitorID ?? randomUUID();
  const metricDate = new Date().toISOString().slice(0, 10);
  const visitorHash = createHmac("sha256", visitorSecret)
    .update(`${metricDate}:${visitorID}`)
    .digest("hex");
  const { slug } = await context.params;
  try {
    await fetch(new URL(`/v1/apps/${encodeURIComponent(slug)}/launches`, apiBaseURL), {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-HogeDD-Metrics-Token": ingestToken },
      body: JSON.stringify({ visitor_hash: visitorHash }),
      cache: "no-store",
      signal: AbortSignal.timeout(3_000),
    });
  } catch {}
  const response = new NextResponse(null, { status: 204 });
  if (!existingVisitorID)
    response.cookies.set(visitorCookieName, visitorID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 31_536_000,
      path: "/",
    });
  return response;
}
