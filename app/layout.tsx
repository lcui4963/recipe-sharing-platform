import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/components/auth/auth-context";
import { Header } from "@/app/components/layout/header";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Sharing Platform",
  description: "Discover and share your favorite recipes with food lovers around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
