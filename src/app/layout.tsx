import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import { ThemeToaster } from "@/components/ui/theme-toaster";
import { getThemeScript } from "@/lib/theme";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flow",
  description: "Project management for engineering and product teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-background font-sans text-text">
        <Script id="flow-theme-init" strategy="beforeInteractive">
          {getThemeScript()}
        </Script>
        <ThemeProvider>
          {children}
          <ThemeToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
