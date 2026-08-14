import express, { type Request, type Response } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { config } from "./config.js";
import { db } from "./db.js";
import { accessToken, refreshToken, tokenHash, verifyAccess, type Identity } from "./auth.js";
import { healthSyncSchema, summarizeHealthRecords, type HealthRecord } from "./health.js";
import { authLimiter, securityHeaders } from "./security.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(securityHeaders);
app.use(cors({ origin: config.WEB_ORIGIN, credentials: true, allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "100kb" }));
app.use("/api/v1/auth", authLimiter);

const credentials = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128)
});
const registration = credentials.extend({ name: z.string().trim().min(2).max(80) });

async function authenticate(req: Request, res: Response): Promise<Identity | null> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "unauthorized" });
    return null;
  }
  try {
    return await verifyAccess(header.slice(7));
  } catch {
    res.status(401).json({ error: "unauthorized" });
    return null;
  }
}

app.get("/health/live", (_req, res) => res.json({ status: "ok" }));
app.get("/health/ready", async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "unavailable" });
  }
});

app.post("/api/v1/auth/register", async (req, res) => {
  const parsed = registration.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return res.status(409).json({ error: "email_exists" });
  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await bcrypt.hash(parsed.data.password, 12)
    }
  });
  const refresh = refreshToken();
  await db.session.create({
    data: { userId: user.id, tokenHash: tokenHash(refresh), expiresAt: new Date(Date.now() + 30 * 86_400_000) }
  });
  return res.status(201).json({
    accessToken: await accessToken({ sub: user.id, email: user.email, role: user.role }),
    refreshToken: refresh,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

app.post("/api/v1/auth/login", async (req, res) => {
  const parsed = credentials.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  const refresh = refreshToken();
  await db.session.create({
    data: { userId: user.id, tokenHash: tokenHash(refresh), expiresAt: new Date(Date.now() + 30 * 86_400_000) }
  });
  return res.json({
    accessToken: await accessToken({ sub: user.id, email: user.email, role: user.role }),
    refreshToken: refresh,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

app.post("/api/v1/auth/refresh", async (req, res) => {
  const parsed = z.object({ refreshToken: z.string().min(40) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_input" });
  const session = await db.session.findUnique({
    where: { tokenHash: tokenHash(parsed.data.refreshToken) },
    include: { user: true }
  });
  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    return res.status(401).json({ error: "invalid_session" });
  }
  const next = refreshToken();
  await db.$transaction([
    db.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } }),
    db.session.create({
      data: { userId: session.userId, tokenHash: tokenHash(next), expiresAt: new Date(Date.now() + 30 * 86_400_000) }
    })
  ]);
  return res.json({
    accessToken: await accessToken({ sub: session.user.id, email: session.user.email, role: session.user.role }),
    refreshToken: next
  });
});

app.post("/api/v1/auth/logout", async (req, res) => {
  const parsed = z.object({ refreshToken: z.string().min(40) }).safeParse(req.body);
  if (parsed.success) {
    await db.session.updateMany({
      where: { tokenHash: tokenHash(parsed.data.refreshToken), revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }
  return res.status(204).end();
});

app.get("/api/v1/auth/me", async (req, res) => {
  const identity = await authenticate(req, res);
  if (!identity) return;
  const user = await db.user.findUnique({
    where: { id: identity.sub },
    select: { id: true, name: true, email: true, role: true, emailVerifiedAt: true }
  });
  return user ? res.json({ user }) : res.status(401).json({ error: "unauthorized" });
});

app.get("/api/v1/workouts", async (req, res) => {
  const identity = await authenticate(req, res);
  if (!identity) return;
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const items = await db.workout.findMany({
    where: { userId: identity.sub },
    orderBy: { createdAt: "desc" },
    take: limit
  });
  return res.json({ items });
});

app.get("/api/v1/dashboard", async (req, res) => {
  const identity = await authenticate(req, res);
  if (!identity) return;
  const startOfWeek = new Date();
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - ((startOfWeek.getUTCDay() + 6) % 7));
  startOfWeek.setUTCHours(0, 0, 0, 0);
  const [workouts, health] = await Promise.all([
    db.workout.findMany({ where: { userId: identity.sub, completedAt: { gte: startOfWeek } } }),
    db.healthMetric.findFirst({ where: { userId: identity.sub }, orderBy: { recordedAt: "desc" } })
  ]);
  return res.json({
    workouts: {
      completedThisWeek: workouts.length,
      volumeThisWeek: workouts.reduce(
        (total: number, workout: { totalVolumeKg: number }) => total + workout.totalVolumeKg,
        0
      )
    },
    wellbeing: { lastSyncAt: health?.recordedAt ?? null }
  });
});

app.get("/api/v1/progress", async (req, res) => {
  const identity = await authenticate(req, res);
  if (!identity) return;
  const recentSessions = await db.workout.findMany({
    where: { userId: identity.sub, completedAt: { not: null } },
    orderBy: { completedAt: "desc" },
    take: 12
  });
  return res.json({
    completedSessions: recentSessions.length,
    totalVolumeKg: recentSessions.reduce(
      (total: number, workout: { totalVolumeKg: number }) => total + workout.totalVolumeKg,
      0
    ),
    recentSessions
  });
});

app.post("/api/v1/health/sync/ingest", async (req, res) => {
  const identity = await authenticate(req, res);
  if (!identity) return;
  const parsed = healthSyncSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid_health_payload" });
  const result = await db.healthMetric.createMany({
    data: parsed.data.records.map((record) => ({
      userId: identity.sub,
      provider: parsed.data.provider,
      type: record.type,
      value: record.value,
      unit: record.unit,
      recordedAt: new Date(record.recordedAt),
      externalId: record.externalId
    })),
    skipDuplicates: true
  });
  return res.status(202).json({ accepted: result.count });
});

app.get("/api/v1/health/summary", async (req, res) => {
  const identity = await authenticate(req, res);
  if (!identity) return;
  const since = new Date(Date.now() - 7 * 86_400_000);
  const rows = await db.healthMetric.findMany({
    where: { userId: identity.sub, recordedAt: { gte: since } },
    orderBy: { recordedAt: "desc" },
    take: 1000
  });
  const records: HealthRecord[] = rows.map((row: {
    type: HealthRecord["type"];
    value: number;
    unit: string;
    recordedAt: Date;
    externalId: string | null;
  }) => ({
    type: row.type,
    value: row.value,
    unit: row.unit,
    recordedAt: row.recordedAt.toISOString(),
    ...(row.externalId ? { externalId: row.externalId } : {})
  }));
  return res.json(summarizeHealthRecords(records));
});

app.use((_req, res) => res.status(404).json({ error: "not_found" }));
app.use((error: unknown, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "internal_error" });
});

if (config.NODE_ENV !== "test") {
  app.listen(config.PORT, () => console.log(`MuscuPro API listening on ${config.PORT}`));
}

export { app };
