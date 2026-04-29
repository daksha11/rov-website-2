// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import Script from "next/script";
import StyledComponentsRegistry from "@/lib/registry";
import { OrganizationSchema } from "@/components/OrganizationSchema";

const inter = Inter({ subsets: ["latin"] });

// Dynamically import the chat widget (client-only)
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), {
  ssr: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rovstudios.com"),
  title: {
    default: "Range of View Studios | Creative Production Agency",
    template: "%s | Range of View Studios",
  },
  description:
    "Range of View Studios is a creative production agency specializing in sound engineering, web development, video production, and AI automation. Based in Atlanta.",
  keywords: [
    "creative agency",
    "sound engineering",
    "web development",
    "video production",
    "AI automation",
    "Atlanta",
    "Range of View Studios",
    "music production",
    "mixing and mastering",
  ],
  authors: [{ name: "Range of View Studios" }],
  creator: "Range of View Studios",
  publisher: "Range of View Studios",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.rovstudios.com",
    siteName: "Range of View Studios",
    title: "Range of View Studios | Creative Production Agency",
    description:
      "Creative production agency specializing in sound engineering, web development, video production, and AI automation.",
    images: [
      {
        url: "/og/og-default.webp",
        width: 1200,
        height: 630,
        alt: "Range of View Studios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rovstudios",
    creator: "@rovstudios",
    title: "Range of View Studios | Creative Production Agency",
    description:
      "Creative production agency specializing in sound engineering, web development, video production, and AI automation.",
    images: ["/og/og-default.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.rovstudios.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <OrganizationSchema />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}

        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
        {/* Floating chatbot */}
        <ChatWidget />
      </body>
    </html>
  );
}
