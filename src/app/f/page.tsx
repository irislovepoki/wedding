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
    url: `${siteConfig.siteUrl}/f`,
    description: youngDescription,
  },
  twitter: {
    description: youngDescription,
  },
};

export default function YoungInvitationPage() {
  return <InvitationPage page3Src="/page-3-young.jpg" />;
}
