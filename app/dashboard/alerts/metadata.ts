import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alerts & Notifications - WebSync | Website Monitoring Platform",
  description:
    "View and manage all alerts and notifications for your monitored websites. Get instant notifications about downtime, performance issues, and other critical events.",
  keywords:
    "website monitoring alerts, downtime notifications, performance issue alerts, website error notifications, real-time alerts, WebSync notifications, website health alerts",
  openGraph: {
    title: "Alerts & Notifications - WebSync Monitoring Platform",
    description:
      "View and manage all alerts and notifications for your monitored websites. Get instant notifications about downtime, performance issues, and other critical events.",
    url: "https://websync.io/dashboard/alerts",
    type: "website",
    images: [
      {
        url: "https://websync.io/og-images/alerts.jpg",
        width: 1200,
        height: 630,
        alt: "WebSync Alerts Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alerts & Notifications - WebSync Monitoring Platform",
    description:
      "View and manage all alerts and notifications for your monitored websites. Get instant notifications about downtime, performance issues, and other critical events.",
    images: ["https://websync.io/twitter-images/alerts.jpg"],
  },
  alternates: {
    canonical: "https://websync.io/dashboard/alerts",
  },
}

