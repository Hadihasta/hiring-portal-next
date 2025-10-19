import { Nunito } from "next/font/google";
import "@/styles/globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
});




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
