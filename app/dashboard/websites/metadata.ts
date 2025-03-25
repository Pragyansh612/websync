import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Websites - WebSync | Website Monitoring Platform",
  description:
    "Manage all your monitored websites in one place. Add new sites, view performance metrics, and configure monitoring settings for optimal website performance tracking.",
  keywords:
    "manage websites, website monitoring, add websites, website performance tracking, uptime monitoring, website management, WebSync monitoring tool, website health tracking",
  openGraph: {
    title: "Manage Websites - WebSync Monitoring Platform",
    description:
      "Manage all your monitored websites in one place. Add new sites, view performance metrics, and configure monitoring settings for optimal website performance tracking.",
    url: "https://websync.io/dashboard/websites",
    type: "website",
    images: [
      {
        url: "https://websync.io/og-images/manage-websites.jpg",
        width: 1200,
        height: 630,
        alt: "WebSync Website Management Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manage Websites - WebSync Monitoring Platform",
    description:
      "Manage all your monitored websites in one place. Add new sites, view performance metrics, and configure monitoring settings for optimal website performance tracking.",
    images: ["https://websync.io/twitter-images/manage-websites.jpg"],
  },
  alternates: {
    canonical: "https://websync.io/dashboard/websites",
  },
}

