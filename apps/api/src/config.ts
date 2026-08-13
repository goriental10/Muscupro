import { z } from "zod";
const schema=z.object({NODE_ENV:z.enum(["development","test","production"]).default("development"),PORT:z.coerce.number().int().positive().default(4000),DATABASE_URL:z.string().min(1),JWT_SECRET:z.string().min(32),WEB_ORIGIN:z.string().url().default("http://localhost:3000"),OAUTH_CLIENT_ID:z.string().min(1).optional(),OAUTH_CLIENT_SECRET:z.string().min(16).optional(),OAUTH_REDIRECT_URIS:z.string().optional()});
export const config=schema.parse(process.env);
