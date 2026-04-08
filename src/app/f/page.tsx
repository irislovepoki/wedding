import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { InvitationPage } from "../components/invitation-page";

const youngDescription = "诚挚邀请您参加我们的婚礼,见证我们的幸福~~";

export const metadata: Metadata = {
  description: youngDescription,
  alternates: {
    canonical: "/f",
  },
  openGraph: {
    title: siteConfig.share.title,
    description: youngDescription,
    url: `${siteConfig.siteUrl}/f`,
    siteName: siteConfig.share.title,
    locale: "zh_CN",
    type: "website",
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
    description: youngDescription,
    images: ["/share-thumb.png"],
  },
};

export default function YoungInvitationPage() {
  return <InvitationPage page3Src="/page-3-young.jpg" />;
}
