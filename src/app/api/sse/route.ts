import { NextRequest } from "next/server";

// ── Fixtures ───────────────────────────────────────────────────────────────────

const LOG_POOL: { level: "INFO" | "WARN" | "ERROR"; msg: string }[] = [
  { level: "INFO",  msg: "Server started on port 3000" },
  { level: "INFO",  msg: "Database connection established" },
  { level: "INFO",  msg: 'GET /api/users → 200 (12 ms)' },
  { level: "INFO",  msg: "Cache miss — fetching from origin" },
  { level: "INFO",  msg: "Scheduled job 'cleanup' fired" },
  { level: "INFO",  msg: 'POST /api/orders → 201 (38 ms)' },
  { level: "WARN",  msg: "Response time exceeded 500 ms threshold" },
  { level: "WARN",  msg: "Memory usage at 78 % — monitor closely" },
  { level: "WARN",  msg: "Deprecated endpoint called: /v1/items" },
  { level: "WARN",  msg: "Rate limit at 80 % for 192.168.1.42" },
  { level: "ERROR", msg: "Failed to connect to Redis — retrying (1/3)" },
  { level: "ERROR", msg: "Uncaught exception in worker thread #2" },
  { level: "ERROR", msg: "Disk write error — /var/log/app.log" },
];

// ── Route Handler ──────────────────────────────────────────────────────────────

/**
 * GET /api/sse
 *
 * Returns a text/event-stream response that emits:
 *   - one "connected" named event immediately
 *   - one "log" named event every ~1.2 s with JSON: { level, msg, time }
 *
 * The interval is cleared when the client disconnects (req.signal 'abort').
 */
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Helper: formats a named SSE event
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      // Announce the stream is open
      send("connected", { message: "Stream open" });

      let tick = 0;

      const interval = setInterval(() => {
        const entry = LOG_POOL[tick % LOG_POOL.length];
        send("log", { ...entry, time: Date.now() });
        tick++;
      }, 1200);

      // Clean up when the client navigates away / unmounts EventSource
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
