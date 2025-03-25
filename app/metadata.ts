import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WebSync - AI-Powered Website Monitoring Platform",
  description:
    "Monitor your websites 24/7 with WebSync's AI-powered analytics. Get instant alerts when issues arise, detect problems before users do, and receive detailed error analysis to fix issues quickly.",
  keywords:
    "website monitoring, uptime monitoring, performance tracking, AI monitoring, website analytics, error detection, downtime alerts, website performance, WebSync monitoring tool, real-time alerts",
  authors: [{ name: "WebSync Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://websync.io",
    title: "WebSync - AI-Powered Website Monitoring Platform",
    description:
      "Monitor your websites 24/7 with WebSync's AI-powered analytics. Get instant alerts when issues arise, detect problems before users do, and receive detailed error analysis to fix issues quickly.",
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
      "Monitor your websites 24/7 with WebSync's AI-powered analytics. Get instant alerts when issues arise, detect problems before users do, and receive detailed error analysis to fix issues quickly.",
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
}

