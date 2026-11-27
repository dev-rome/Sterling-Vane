import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;
// Local, preview and production share one database, so keep their counts apart.
const env = process.env.VERCEL_ENV ?? "development";

// Per visitor: a short burst limit and a daily limit.
// For the whole site: a daily cap that protects the AI credits.
const limiters = redis
  ? [
      {
        name: "minute",
        limiter: new Ratelimit({
          redis,
          prefix: `concierge:${env}:min`,
          limiter: Ratelimit.slidingWindow(10, "1 m"),
        }),
        perVisitor: true,
        error:
          "You’re sending messages quickly. Please wait a minute and try again.",
      },
      {
        name: "day",
        limiter: new Ratelimit({
          redis,
          prefix: `concierge:${env}:day`,
          limiter: Ratelimit.fixedWindow(40, "1 d"),
        }),
        perVisitor: true,
        error:
          "You’ve reached today’s concierge limit. Please call the shop or book online.",
      },
      {
        name: "site",
        limiter: new Ratelimit({
          redis,
          prefix: `concierge:${env}:site`,
          limiter: Ratelimit.fixedWindow(500, "1 d"),
        }),
        perVisitor: false,
        error:
          "The concierge is very busy today. Please call the shop or book online.",
      },
    ]
  : [];

type RateLimitResult =
  | { ok: true }
  | { ok: false; status: number; error: string; retryAfter?: number };

function getVisitorId(request: Request) {
  // On Vercel, the first address in x-forwarded-for is the visitor's IP.
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  );
}

export async function checkRateLimit(
  request: Request,
): Promise<RateLimitResult> {
  if (!redis) {
    // Fine on a fresh local clone; never allowed in production.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[rate-limit] KV_REST_API_URL / KV_REST_API_TOKEN are missing.",
      );
      return {
        ok: false,
        status: 503,
        error: "The concierge is unavailable right now.",
      };
    }
    return { ok: true };
  }

  const visitor = getVisitorId(request);

  try {
    for (const { limiter, perVisitor, error } of limiters) {
      const { success, reset } = await limiter.limit(
        perVisitor ? visitor : "all",
      );
      if (!success) {
        const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
        return { ok: false, status: 429, error, retryAfter };
      }
    }
    return { ok: true };
  } catch (error) {
    // If Redis is down, stop rather than allow unlimited AI calls.
    console.error("[rate-limit]", error);
    return {
      ok: false,
      status: 503,
      error: "The concierge is unavailable right now.",
    };
  }
}
