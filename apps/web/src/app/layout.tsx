import type { Metadata } from "next";
import "./globals.css";
import { FitnessProvider } from "@/components/fitness-provider";
export const metadata: Metadata = { title: "MuscuPro Global", description: "Entraînement, progression et coaching dans une interface claire." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr-CA"><body><FitnessProvider>{children}</FitnessProvider></body></html>; }
