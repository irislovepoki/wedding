import { readRSVPSubmissions, rsvpStorageInfo } from "@/lib/rsvp-store";

export const dynamic = "force-dynamic";

export default async function RSVPViewPage() {
  const submissions = await readRSVPSubmissions();

  return (
    <main className="min-h-screen bg-[#4d1c20] px-5 py-8 text-[#f1dfc1]">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl tracking-[0.18em]">RSVP SUBMISSIONS</h1>
        <p className="mt-3 text-sm text-[#e3cba4]/80">
          当前数据来源:
          {" "}
          {rsvpStorageInfo.label}
        </p>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-[#d7b27a]/45 bg-[#6a2b30]/70">
          {submissions.length === 0 ? (
            <p className="px-5 py-6 text-sm text-[#f4ead7]/80">还没有收到 RSVP 提交。</p>
          ) : (
            <ul className="divide-y divide-[#d7b27a]/20">
              {submissions.map((submission, index) => (
                <li key={`${submission.name}-${submission.submittedAt}-${index}`} className="px-5 py-4">
                  <p className="text-lg">{submission.name}</p>
                  <p className="mt-1 text-sm text-[#f4ead7]/78">出席人数: {submission.guests}</p>
                  <p className="mt-1 text-xs text-[#d8c1a1]/60">{submission.submittedAt}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
