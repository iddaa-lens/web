import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import LeftSidebar from "@/components/layout/LeftSidebar";
import MobileLayout from "@/components/layout/MobileLayout";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IddaaLens",
  description: "Bahis analiz paneli",
  applicationName: "IddaaLens",
  keywords: ["iddaa", "bahis", "analiz"],
  authors: [{ name: "Development Team" }],
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1419" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}
      >
        <ToastProvider>
          {/* Mobile-first responsive layout */}
          <div className="w-full min-h-screen">
            {/* Mobile layout: drawer navigation */}
            <div className="md:hidden">
              <MobileLayout>{children}</MobileLayout>
            </div>

            {/* Desktop layout: centered with sidebar */}
            <div className="hidden md:flex justify-center w-full">
              <div className="flex w-full max-w-[1315px]">
                {/* Left sidebar */}
                <div className="sidebar-left sticky top-0 h-screen overflow-y-auto">
                  <LeftSidebar />
                </div>

                {/* Main content */}
                <main className="main-content border-x border-gray-200 dark:border-gray-800 min-h-screen">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}