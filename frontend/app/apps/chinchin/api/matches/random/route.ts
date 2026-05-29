import { joinRandomMatch } from "@/app/apps/chinchin/_lib/online-matches";

export async function POST() {
  return Response.json(joinRandomMatch(), { status: 201 });
}
