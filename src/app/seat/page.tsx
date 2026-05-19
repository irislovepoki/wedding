import Image from "next/image";
import type { Metadata } from "next";
import { SeatSearchForm } from "@/app/components/seat-search-form";
import { getSeatLookupUrl } from "@/lib/seat-qr";

const seatLookupDescription = "请输入您的姓名或名字首字母,查询您的桌号。";

export const metadata: Metadata = {
  title: "婚礼座位查询",
  description: seatLookupDescription,
  alternates: {
    canonical: "/seat",
  },
  openGraph: {
    title: "婚礼座位查询",
    description: seatLookupDescription,
    url: getSeatLookupUrl(),
  },
  twitter: {
    card: "summary",
    title: "婚礼座位查询",
    description: seatLookupDescription,
  },
};

export default function SeatLookupPage() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,#61262b_0%,#4d1c20_48%,#3f1216_100%)] px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        <div className="w-full text-center text-[#f8ebd4]">
          <p className="text-xs tracking-[0.34em] text-[#d8b47b]">WEDDING SEAT LOOKUP</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">查询您的桌号</h1>
          <div className="mx-auto mt-4 w-full max-w-[18rem] sm:max-w-[20rem]">
            <Image
              src="/seat-layout-bottom.png"
              alt="婚礼席位图"
              width={1290}
              height={2796}
              sizes="100vw"
              className="block h-auto w-full"
            />
          </div>
        </div>

        <div className="mt-8 w-full">
          <SeatSearchForm />
        </div>
      </div>
    </main>
  );
}
