import type { Metadata } from "next";
import { SeatSearchForm } from "@/app/components/seat-search-form";
import { getSeatLookupUrl } from "@/lib/seat-qr";

export const metadata: Metadata = {
  title: "婚礼座位查询",
  description: "请输入姓名或名字首字母，快速查询婚礼桌号。",
  alternates: {
    canonical: "/seat",
  },
  openGraph: {
    title: "婚礼座位查询",
    description: "请输入姓名或名字首字母，快速查询婚礼桌号。",
    url: getSeatLookupUrl(),
  },
};

export default function SeatLookupPage() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,#61262b_0%,#4d1c20_48%,#3f1216_100%)] px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        <div className="w-full text-center text-[#f8ebd4]">
          <p className="text-xs tracking-[0.34em] text-[#d8b47b]">WEDDING SEAT LOOKUP</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">查询你的桌号</h1>
          <p className="mt-4 text-sm leading-7 text-[#f4dfc0]/86 sm:text-base">
            请输入你的名字或名字首字母，查询完成后会显示你对应的桌号。
          </p>
        </div>

        <div className="mt-8 w-full">
          <SeatSearchForm />
        </div>
      </div>
    </main>
  );
}
