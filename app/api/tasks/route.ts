import { NextResponse } from "next/server";

const defaultAPIBaseURL = "http://localhost:8080";

function getAPIBaseURL() {
  return process.env.API_BASE_URL ?? defaultAPIBaseURL;
}

export async function GET() {
  try {
    const response = await fetch(`${getAPIBaseURL()}/tasks`, {
      cache: "no-store",
    });

    const body = await response.text();
    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json({ error: "api server is not reachable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const response = await fetch(`${getAPIBaseURL()}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: await request.text(),
    });

    const body = await response.text();
    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json({ error: "api server is not reachable" }, { status: 503 });
  }
}
