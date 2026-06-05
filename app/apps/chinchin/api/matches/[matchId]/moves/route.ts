import { placeOnlineMove } from "@/app/apps/chinchin/_lib/online-matches";

type MoveRequest = {
  playerId?: unknown;
  index?: unknown;
};

export async function POST(request: Request, context: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await context.params;
  const body = (await request.json()) as MoveRequest;

  if (typeof body.playerId !== "string" || typeof body.index !== "number") {
    return Response.json({ error: "invalid request body" }, { status: 400 });
  }

  const result = placeOnlineMove({
    matchId,
    playerId: body.playerId,
    index: body.index,
  });

  if (result.error) {
    const status = result.error === "match not found" ? 404 : 409;
    return Response.json({ error: result.error }, { status });
  }

  return Response.json({ match: result.match });
}
