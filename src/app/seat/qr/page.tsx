import type { Metadata } from "next";
import { SeatLookupPromo } from "@/app/components/seat-lookup-promo";

const seatQrDescription = "现场扫码后可直接进入婚礼座位查询页面。";
const seatShareImage = "/share-thumb.png";

export const metadata: Metadata = {
  title: "婚礼座位查询二维码",
  description: seatQrDescription,
  alternates: {
    canonical: "/seat/qr",
  },
  openGraph: {
    title: "婚礼座位查询二维码",
    description: seatQrDescription,
    images: [
      {
        url: seatShareImage,
        width: 1200,
        height: 630,
        alt: "婚礼座位查询二维码分享图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "婚礼座位查询二维码",
    description: seatQrDescription,
    images: [seatShareImage],
  },
};

export default function SeatLookupQrPage() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,#61262b_0%,#4d1c20_48%,#3f1216_100%)] px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <SeatLookupPromo />
      </div>
    </main>
  );
}
