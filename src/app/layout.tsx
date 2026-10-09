import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "5Y54DM1N5",
  description: "Learn systems administration through lessons, quizzes, and hands-on labs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rajdhani.variable}>
      <body className="font-sans antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
