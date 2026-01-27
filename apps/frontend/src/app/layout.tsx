import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CoreHub - Suite Gestionale",
  description: "Dashboard centralizzata per la gestione delle applicazioni CoreSuite",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
