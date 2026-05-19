import type { Metadata } from "next";
import { SeatLookupPromo } from "@/app/components/seat-lookup-promo";

export const metadata: Metadata = {
  title: "婚礼座位查询二维码",
  description: "现场扫码后可直接进入婚礼座位查询页面。",
  alternates: {
    canonical: "/seat/qr",
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
