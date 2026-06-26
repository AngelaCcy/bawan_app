// Simple sliding-window rate limiter backed by module-level Map.
// Works per serverless instance — good enough for low-to-medium traffic.
// For high traffic, replace with @upstash/ratelimit + Vercel KV.

const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { ok: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { ok: true, remaining: limit - record.count, resetAt: record.resetAt };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
