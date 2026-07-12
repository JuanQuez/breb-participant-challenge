import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bre-B Participant | Mono",
  description: "Integración con la API de Bre-B Participant de Mono",
    icons: {
    icon: "/ico/favicon.ico",
    shortcut: "/ico/favicon.ico",
    apple: "/ico/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-surface text-ink antialiased">{children}</body>
    </html>
  );
}
