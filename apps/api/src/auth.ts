import { createHash, randomBytes } from "node:crypto";import { SignJWT, jwtVerify } from "jose";import { config } from "./config.js";
const key=new TextEncoder().encode(config.JWT_SECRET);export type Identity={sub:string;email:string;role:string};
export async function accessToken(user:Identity){return new SignJWT({email:user.email,role:user.role}).setProtectedHeader({alg:"HS256"}).setSubject(user.sub).setIssuedAt().setExpirationTime("15m").sign(key)}
export async function verifyAccess(token:string){const {payload}=await jwtVerify(token,key);return payload as unknown as Identity}
export function refreshToken(){return randomBytes(48).toString("base64url")}export function tokenHash(token:string){return createHash("sha256").update(token).digest("hex")}
