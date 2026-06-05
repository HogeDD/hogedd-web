import { getMatch } from "@/app/apps/chinchin/_lib/online-matches";

export async function GET(_request: Request, context: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await context.params;
  const match = getMatch(matchId);

  if (!match) {
    return Response.json({ error: "match not found" }, { status: 404 });
  }

  return Response.json({ match });
}
