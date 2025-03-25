import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Settings - WebSync | Website Monitoring Platform",
  description:
    "Configure your WebSync account settings, notification preferences, integrations, and security options for optimal website monitoring experience.",
  keywords:
    "account settings, notification preferences, website monitoring settings, WebSync configuration, monitoring integrations, security settings, alert configuration",
  openGraph: {
    title: "Account Settings - WebSync Monitoring Platform",
    description:
      "Configure your WebSync account settings, notification preferences, integrations, and security options for optimal website monitoring experience.",
    url: "https://websync.io/settings",
    type: "website",
    images: [
      {
        url: "https://websync.io/og-images/settings.jpg",
        width: 1200,
        height: 630,
        alt: "WebSync Account Settings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Account Settings - WebSync Monitoring Platform",
    description:
      "Configure your WebSync account settings, notification preferences, integrations, and security options for optimal website monitoring experience.",
    images: ["https://websync.io/twitter-images/settings.jpg"],
  },
  alternates: {
    canonical: "https://websync.io/settings",
  },
}

