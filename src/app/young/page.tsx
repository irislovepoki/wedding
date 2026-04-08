import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { InvitationPage } from "../components/invitation-page";

export const metadata: Metadata = {
  alternates: {
    canonical: "/young",
  },
  openGraph: {
    url: `${siteConfig.siteUrl}/young`,
  },
};

export default function YoungInvitationPage() {
  return <InvitationPage page3Src="/page-3-young.jpg" />;
}
