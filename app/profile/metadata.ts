import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "User Profile - WebSync | Website Monitoring Platform",
  description:
    "Manage your WebSync user profile, account settings, and preferences. Update your personal information and customize your website monitoring experience.",
  keywords:
    "user profile, account settings, website monitoring preferences, WebSync account, user settings, monitoring configuration, personal profile",
  openGraph: {
    title: "User Profile - WebSync Monitoring Platform",
    description:
      "Manage your WebSync user profile, account settings, and preferences. Update your personal information and customize your website monitoring experience.",
    url: "https://websync.io/profile",
    type: "website",
    images: [
      {
        url: "https://websync.io/og-images/profile.jpg",
        width: 1200,
        height: 630,
        alt: "WebSync User Profile Settings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "User Profile - WebSync Monitoring Platform",
    description:
      "Manage your WebSync user profile, account settings, and preferences. Update your personal information and customize your website monitoring experience.",
    images: ["https://websync.io/twitter-images/profile.jpg"],
  },
  alternates: {
    canonical: "https://websync.io/profile",
  },
}

