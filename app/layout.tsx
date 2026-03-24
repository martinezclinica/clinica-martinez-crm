import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clinica-martinez.lat"),
  title: {
    default: "Clinica Martinez | Acceso",
    template: "%s | Clinica Martinez",
  },
  description:
    "CRM privado para leads, marketing y gestion comercial de Clinica Martinez.",
  icons: {
    icon: "/favicon-omni.ico",
    shortcut: "/favicon-omni.ico",
    apple: "/favicon-omni.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
