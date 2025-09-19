import "@/interfaces/ui/styles/globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DIABOT V4 - Diabetes Management",
  description: "Smart diabetes management with AI assistance",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className + " bg-bg text-text min-h-screen"}>
        {children}
      </body>
    </html>
  );
}