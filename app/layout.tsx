import type { Metadata } from "next";
import { Geist, Libertinus_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/provider/query-provider";
import { TRPCReactProvider } from "@/lib/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/google/analytics";
import { AdSenseManager } from "@/components/google/adsense";
import { GTMManager } from "@/components/google/tag-manager";
import AdScript from "@/components/google/ad-script";
import GtmScript from "@/components/google/gtm-script";
import AnalyticScript from "@/components/google/analytic-script";
import AdPopupModal from "@/components/ad-popup-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const libertinusSerif = Libertinus_Serif({
  variable: "--font-libertinus-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:
      "Green Farm Prediction - Top Football / Basketball Tips and Prediction Website",
    template: "%s - Green Farm",
  },
  description:
    "Harvest your winnings here with us, boost your earnings here with us, increase your net worth here with us, green farm prediction got you covered",
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
  },
  authors: {
    name: "Green Farm",
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title:
      "Green Farm Prediction - Top Football / Basketball Tips and Prediction Website",
    description:
      "Harvest your winnings here with us, boost your earnings here with us, increase your net worth here with us, green farm prediction got you covered",
    images: [
      {
        url: "/logo.png",
      },
    ],
    siteName: "Green Farm Prediction",
  },
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
      sizes: "800x600",
      type: "image/jpeg",
    },
  ],
  publisher: "Green Farm",
  category: "Sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${libertinusSerif.variable} font-serif antialiased`}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Analytics />
              <AdSenseManager />
              <AdPopupModal />
              <GTMManager />
              <AdScript />
              <GtmScript />
              <AnalyticScript />
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </TRPCReactProvider>
  );
}
