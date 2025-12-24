import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Stacks Holiday Gifts 🎁",
  description: "Send STX gifts to friends and family for the holidays!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans antialiased bg-gray-950 text-white min-h-screen`}>
        <WalletProvider>
          {/* Animated background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 text-4xl opacity-20 animate-pulse">❄️</div>
            <div className="absolute top-40 right-20 text-3xl opacity-20 animate-pulse delay-150">❄️</div>
            <div className="absolute bottom-32 left-1/4 text-2xl opacity-20 animate-pulse delay-300">❄️</div>
            <div className="absolute top-1/3 right-1/3 text-3xl opacity-20 animate-pulse delay-500">✨</div>
            <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-pulse delay-700">🎄</div>
          </div>

          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
