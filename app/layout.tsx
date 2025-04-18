import type { ReactNode } from "react"
import type { Metadata } from "next"
import ClientLayout from "./clientLayout"

export const metadata: Metadata = {
  title: "WebSync - AI-Powered Website Monitoring Platform",
  description:
    "Monitor your websites 24/7 with AI-powered analytics, get instant alerts when issues arise, and receive detailed error analysis to fix problems quickly.",
  keywords:
    "website monitoring, uptime monitoring, performance tracking, AI monitoring, website analytics, error detection, downtime alerts, website performance",
  authors: [{ name: "WebSync Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://websync.io",
    title: "WebSync - AI-Powered Website Monitoring Platform",
    description:
      "Get instant notifications when your website goes down. WebSync uses AI to analyze errors and provide actionable insights to fix issues quickly.",
    siteName: "WebSync",
    images: [
      {
        url: "https://websync.io/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "WebSync Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebSync - AI-Powered Website Monitoring Platform",
    description:
      "Get instant notifications when your website goes down. WebSync uses AI to analyze errors and provide actionable insights to fix issues quickly.",
    images: ["https://websync.io/twitter-image.jpg"],
    creator: "@websync",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://websync.io",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}