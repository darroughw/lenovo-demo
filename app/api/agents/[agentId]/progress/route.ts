import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// In-memory per-agent progress. Resets on server restart — fine for a demo
// endpoint standing in for a real task-progress store.
const progressByAgent = new Map<string, number>();

export async function GET(
  _request: NextRequest,
  { params }: RouteContext<"/api/agents/[agentId]/progress">
) {
  const { agentId } = await params;
  const current = progressByAgent.get(agentId) ?? 0;
  const next = Math.min(100, current + Math.floor(Math.random() * 12) + 4);
  progressByAgent.set(agentId, next);

  return Response.json({ progress: next });
}
