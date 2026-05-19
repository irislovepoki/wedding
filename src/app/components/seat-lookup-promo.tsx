import Image from "next/image";
import Link from "next/link";
import { getSeatLookupQrDataUrl, getSeatLookupUrl, seatLookupPath } from "@/lib/seat-qr";

export async function SeatLookupPromo() {
  const qrDataUrl = await getSeatLookupQrDataUrl();
  const seatLookupUrl = getSeatLookupUrl();

  return (
    <section className="px-5 py-12 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 rounded-[2rem] border border-[#b98763]/45 bg-[linear-gradient(180deg,rgba(251,241,223,0.96),rgba(245,228,201,0.94))] px-6 py-8 text-[#5a2326] shadow-[0_24px_60px_rgba(24,6,7,0.2)] sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl text-center lg:text-left">
          <p className="text-xs tracking-[0.32em] text-[#9a6d57]">SEAT LOOKUP</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">婚礼座位查询</h2>
          <p className="mt-3 text-sm leading-7 text-[#7d5658] sm:text-base">
            宾客输入姓名、拼音或首字母，即可查询对应桌号。你也可以把右侧二维码保存下来，放到现场让宾客直接扫码查询。
          </p>

          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={seatLookupPath}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#6a292c] px-6 text-sm font-medium text-[#fbf1df] transition hover:bg-[#5a2326]"
            >
              打开查询页
            </Link>
            <p className="text-xs text-[#936a61]">{seatLookupUrl}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="rounded-[2rem] bg-white p-4 shadow-[0_14px_30px_rgba(90,35,38,0.14)]">
            <Image
              src={qrDataUrl}
              alt="婚礼座位查询二维码"
              width={160}
              height={160}
              unoptimized
              className="block h-40 w-40"
            />
          </div>
          <p className="text-xs text-[#936a61]">扫码后直接进入座位查询页</p>
        </div>
      </div>
    </section>
  );
}
