import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - WebSync | Monitor Your Websites in Real-Time",
  description:
    "Access your WebSync dashboard to monitor website performance, view uptime statistics, receive real-time alerts, and analyze website health with AI-powered insights.",
  keywords:
    "website monitoring dashboard, website performance dashboard, uptime statistics, real-time website monitoring, error analytics, performance metrics, WebSync dashboard, website health monitoring",
  openGraph: {
    title: "WebSync Dashboard - Monitor Your Websites in Real-Time",
    description:
      "Access your WebSync dashboard to monitor website performance, view uptime statistics, receive real-time alerts, and analyze website health with AI-powered insights.",
    url: "https://websync.io/dashboard",
    type: "website",
    images: [
      {
        url: "https://websync.io/og-images/dashboard.jpg",
        width: 1200,
        height: 630,
        alt: "WebSync Dashboard Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebSync Dashboard - Monitor Your Websites in Real-Time",
    description:
      "Access your WebSync dashboard to monitor website performance, view uptime statistics, receive real-time alerts, and analyze website health with AI-powered insights.",
    images: ["https://websync.io/twitter-images/dashboard.jpg"],
  },
  alternates: {
    canonical: "https://websync.io/dashboard",
  },
}

