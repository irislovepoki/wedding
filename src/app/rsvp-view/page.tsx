"use client";

import { useEffect, useState } from "react";
import { fetchRSVPSubmissions, type RSVPSubmission } from "@/lib/supabase-client";

export default function RSVPViewPage() {
  const [submissions, setSubmissions] = useState<RSVPSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRSVPSubmissions()
      .then(setSubmissions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#4d1c20] px-5 py-8 text-[#f1dfc1]">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl tracking-[0.18em]">RSVP SUBMISSIONS</h1>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-[#d7b27a]/45 bg-[#6a2b30]/70">
          {loading ? (
            <p className="px-5 py-6 text-sm text-[#f4ead7]/80">加载中…</p>
          ) : submissions.length === 0 ? (
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
