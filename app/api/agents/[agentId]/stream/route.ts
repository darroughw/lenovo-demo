import type { NextRequest } from "next/server";
import { getAgentResponse } from "@/src/lib/agentSamples";

export const dynamic = "force-dynamic";

const TOKEN_INTERVAL_MS = 120;

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/agents/[agentId]/stream">
) {
  const { agentId } = await params;
  const words = getAgentResponse(agentId).split(" ");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let index = 0;
      let closed = false;

      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // Already closed by the client disconnecting.
        }
      };

      const interval = setInterval(() => {
        if (index >= words.length) {
          controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
          close();
          return;
        }
        const payload = JSON.stringify({ token: words[index] });
        controller.enqueue(
          encoder.encode(`event: token\ndata: ${payload}\n\n`)
        );
        index += 1;
      }, TOKEN_INTERVAL_MS);

      request.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
