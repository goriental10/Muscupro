import { createHmac, timingSafeEqual } from "node:crypto";
export type SessionUser={id:string;name:string;email:string;role:"ATHLETE"|"COACH"};
const sign=(value:string)=>createHmac("sha256",process.env.AUTH_SECRET??"development-only-change-me").update(value).digest("base64url");
export function createSessionToken(user:SessionUser){const payload=Buffer.from(JSON.stringify({user,expiresAt:Date.now()+43_200_000})).toString("base64url");return `${payload}.${sign(payload)}`}
export function verifySessionToken(token?:string){if(!token)return null;const [payload,signature]=token.split(".");if(!payload||!signature)return null;const a=Buffer.from(signature),b=Buffer.from(sign(payload));if(a.length!==b.length||!timingSafeEqual(a,b))return null;try{const parsed=JSON.parse(Buffer.from(payload,"base64url").toString()) as {user:SessionUser;expiresAt:number};return parsed.expiresAt>Date.now()?parsed.user:null}catch{return null}}
