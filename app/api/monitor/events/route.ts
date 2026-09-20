import type { NextRequest } from "next/server";
import { getRandomFinding } from "@/src/lib/monitorFindings";

export const dynamic = "force-dynamic";

const MIN_DELAY_MS = 6000;
const MAX_DELAY_MS = 14000;

function nextDelay(): number {
  return MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
}

// Findings arrive on a randomized delay rather than a fixed interval — the
// monitor reacts whenever simulated portfolio data changes, it isn't polling
// on a schedule.
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  let findingCounter = 0;

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      let timeoutId: ReturnType<typeof setTimeout>;

      const close = () => {
        if (closed) return;
        closed = true;
        clearTimeout(timeoutId);
        try {
          controller.close();
        } catch {
          // Already closed by the client disconnecting.
        }
      };

      const emit = () => {
        findingCounter += 1;
        const finding = {
          id: `finding-${Date.now()}-${findingCounter}`,
          createdAt: Date.now(),
          ...getRandomFinding(),
        };
        controller.enqueue(
          encoder.encode(`event: finding\ndata: ${JSON.stringify(finding)}\n\n`)
        );
        timeoutId = setTimeout(emit, nextDelay());
      };

      timeoutId = setTimeout(emit, nextDelay());
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
