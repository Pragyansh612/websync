import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Performance Reports - WebSync | Website Monitoring Platform",
  description:
    "Access detailed performance reports and analytics for your websites. Track uptime, response time, and other key metrics to optimize your website performance.",
  keywords:
    "website performance reports, uptime reports, response time analytics, website monitoring reports, performance analytics, WebSync reports, website health metrics",
  openGraph: {
    title: "Performance Reports - WebSync Monitoring Platform",
    description:
      "Access detailed performance reports and analytics for your websites. Track uptime, response time, and other key metrics to optimize your website performance.",
    url: "https://websync.io/dashboard/reports",
    type: "website",
    images: [
      {
        url: "https://websync.io/og-images/reports.jpg",
        width: 1200,
        height: 630,
        alt: "WebSync Performance Reports",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Performance Reports - WebSync Monitoring Platform",
    description:
      "Access detailed performance reports and analytics for your websites. Track uptime, response time, and other key metrics to optimize your website performance.",
    images: ["https://websync.io/twitter-images/reports.jpg"],
  },
  alternates: {
    canonical: "https://websync.io/dashboard/reports",
  },
}

