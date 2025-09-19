import "@/styles/index.css";
import { Inter } from "next/font/google";
import FloatingAIBtn from "@/interfaces/ui/components/FloatingAIBtn";
import FAB_AI from "@/interfaces/ui/components/FAB_AI";
import BottomNav from "@/interfaces/ui/components/BottomNav";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DIABOT V4 - Diabetes Management",
  description: "Smart diabetes management with AI assistance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className + " bg-bg text-text min-h-screen"}>
        {children}
          <FloatingAIBtn />   {/* ⬅️ FAB AI tách khỏi BottomNav */}
        <BottomNav />
      </body>
    </html>
  );
}
