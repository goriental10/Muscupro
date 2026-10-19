"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const messages: Record<string, string> = { invalid_credentials: "Courriel ou mot de passe incorrect.", email_exists: "Un compte utilise déjà cette adresse.", invalid_input: "Vérifiez les informations saisies.", api_unavailable: "Le serveur de comptes est indisponible pour le moment." };
export function AuthForm({ mode }: { mode: "login" | "register" }) {
 const router = useRouter(), [error, setError] = useState(""), [pending, setPending] = useState(false);
 async function submit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault(); setError(""); setPending(true);
  const data = new FormData(event.currentTarget);
  try {
   const response = await fetch(`/api/auth/${mode}`, { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(Object.fromEntries(data)), signal:AbortSignal.timeout(15000) });
   const result = await response.json();
   if (!response.ok) { setError(messages[result.error] ?? "La connexion au serveur de comptes n’a pas abouti. Réessayez plus tard."); return; }
   router.push("/profile"); router.refresh();
  } catch { setError("Le serveur de comptes ne répond pas. Vos données locales restent disponibles dans votre espace."); }
  finally { setPending(false); }
 }
 return <main className="auth"><section className="auth-card"><p className="eyebrow">MuscuPro Global · Compte serveur</p><h1>{mode === "login" ? "Connexion" : "Créer un compte"}</h1><p className="muted">Ce compte nécessite la mise en service de l’API. L’espace personnel sur cet appareil reste accessible sans connexion.</p><form onSubmit={submit}>{mode === "register" && <label className="field">Nom<input name="name" minLength={2} maxLength={80} autoComplete="name" required /></label>}<label className="field">Courriel<input name="email" type="email" autoComplete="email" required /></label><label className="field">Mot de passe<input name="password" type="password" minLength={8} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} required /></label>{error && <p role="alert" className="alert error">{error}</p>}<button className="button" type="submit" disabled={pending}>{pending ? "Connexion en cours…" : mode === "login" ? "Se connecter" : "Créer mon compte"}</button></form><p className="muted">{mode === "login" ? <Link href="/register">Créer un compte serveur</Link> : <Link href="/login">J’ai déjà un compte</Link>}</p><Link href="/dashboard" className="text-link">Revenir à mon espace personnel →</Link></section></main>;
}
