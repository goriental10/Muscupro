import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "MuscuPro Global", description: "Entraînement, progression et coaching dans une interface claire." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr-CA"><body>{children}</body></html>; }
