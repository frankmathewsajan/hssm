// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react"; // 👈 1. IMPORT THIS
import { Toaster } from "sonner"; // Ensure your global toaster is active

const inter = Inter({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({subsets: ["latin"], variable: "--font-serif"});
const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"]});
const geistMono = Geist_Mono({variable: "--font-geist-mono", subsets: ["latin"]});

export const metadata: Metadata = {
  title: "HSS Manager",
  description: "Advanced School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full", 
        "antialiased", 
        geistSans.variable, 
        geistMono.variable, 
        inter.variable, 
        playfair.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        {/* 👈 2. WRAP WITH SESSIONPROVIDER */}
        <SessionProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors closeButton position="top-right" />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}