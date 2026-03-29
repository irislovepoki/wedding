import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/content/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#efe3d2",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.share.title,
  description: siteConfig.share.description,
  applicationName: siteConfig.share.title,
  keywords: ["婚礼邀请", "婚礼请柬", "微信分享", siteConfig.couple.primaryName, siteConfig.couple.secondaryName],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteConfig.siteUrl,
    siteName: siteConfig.share.title,
    title: siteConfig.share.title,
    description: siteConfig.share.description,
    images: [
      {
        url: "/share-thumb.png",
        width: 1024,
        height: 1024,
        alt: siteConfig.share.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteConfig.share.title,
    description: siteConfig.share.description,
    images: ["/share-thumb.png"],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.share.title,
    statusBarStyle: "default",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
