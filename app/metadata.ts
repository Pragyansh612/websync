import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WebSync - Smart Website Monitoring with AI-Powered Insights",
  description:
    "Keep your websites running smoothly with WebSync's intelligent monitoring platform. Get instant alerts when issues arise, detect problems before users do, and receive actionable insights to fix issues quickly.",
  keywords:
    "website monitoring, uptime monitoring, performance tracking, AI monitoring, website analytics, error detection, downtime alerts, website performance, WebSync, real-time alerts",
  authors: [{ name: "WebSync Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://websync.io",
    title: "WebSync - Smart Website Monitoring with AI-Powered Insights",
    description:
      "Keep your websites running smoothly with WebSync's intelligent monitoring platform. Get instant alerts when issues arise, detect problems before users do, and receive actionable insights to fix issues quickly.",
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
    title: "WebSync - Smart Website Monitoring with AI-Powered Insights",
    description:
      "Keep your websites running smoothly with WebSync's intelligent monitoring platform. Get instant alerts when issues arise, detect problems before users do, and receive actionable insights to fix issues quickly.",
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
