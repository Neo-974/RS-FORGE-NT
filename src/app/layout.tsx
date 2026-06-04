import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RS-Builder — by NéoTechno Formation",
  description: "L'assistant expert qui transforme votre expertise en certification RS reconnue.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
