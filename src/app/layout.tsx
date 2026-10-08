import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sysadmin Academy",
  description: "Learn systems administration through lessons, quizzes, and hands-on labs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
