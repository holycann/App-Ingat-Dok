import type React from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import Background from "@/components/Background";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "IngatDok - Asisten Digital Dokumen Legal Indonesia",
  description:
    "AI-powered reminder untuk SIM, STNK, passport, dan dokumen legal. Upload, ekstrak otomatis, dapat reminder sebelum expire.",
  keywords: "dokumen legal, SIM, STNK, passport, reminder, AI OCR, Indonesia",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakarta.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background dark:bg-background min-h-screen overflow-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <div className="fixed w-full left-0 top-0 h-full z-50">
              <Sidebar>
                <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900">
                  <main className="w-full h-full border rounded-2xl overflow-y-auto overscroll-contain">
                    <div className="p-4 h-full overflow-y-auto overscroll-contain">
                      <Background />
                      {children}
                    </div>
                  </main>
                </div>
              </Sidebar>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
