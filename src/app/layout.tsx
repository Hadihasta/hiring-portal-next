import type { Metadata } from "next";
import { Geist, Geist_Mono ,Nunito } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // customize weights as needed
});


export const metadata: Metadata = {
  title: "Hiring Web Portal",
  description: "Hiring Web Portal built with Next.js and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${nunito.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
