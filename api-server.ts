const apiUrl=(process.env.API_URL??"http://localhost:4000").replace(/\/$/,"");
export async function apiRequest(path:string,init?:RequestInit){return fetch(`${apiUrl}${path}`,{...init,headers:{"content-type":"application/json",...init?.headers},cache:"no-store"})}
export const authCookie={httpOnly:true,sameSite:"lax" as const,secure:process.env.NODE_ENV==="production",path:"/"};
