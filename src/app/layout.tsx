import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description: "Play Tic-Tac-Toe round by round and keep a history of finished matches.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
