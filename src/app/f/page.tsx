import type { Metadata, ResolvingMetadata } from "next";
import { siteConfig } from "@/content/site";
import { InvitationPage } from "../components/invitation-page";

const youngDescription = "诚挚邀请您参加我们的婚礼,见证我们的幸福~~";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    description: youngDescription,
    alternates: {
      canonical: "/f",
    },
    openGraph: {
      ...parentMetadata.openGraph,
      url: `${siteConfig.siteUrl}/f`,
      description: youngDescription,
      images: parentMetadata.openGraph?.images,
    },
    twitter: {
      ...parentMetadata.twitter,
      description: youngDescription,
      images: parentMetadata.twitter?.images,
    },
  };
}

export default function YoungInvitationPage() {
  return <InvitationPage page3Src="/page-3-young.jpg" />;
}
