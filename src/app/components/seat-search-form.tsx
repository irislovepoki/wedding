"use client";

import { useState } from "react";
import { searchSeatAssignments, type SeatSearchMatch } from "@/lib/seat-search";

export function SeatSearchForm() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<SeatSearchMatch[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("请输入姓名或名字首字母");
      setMatches([]);
      setSearched(false);
      return;
    }

    setError("");
    setMatches(searchSeatAssignments(trimmedQuery).slice(0, 8));
    setSearched(true);
  }

  const exactSingleMatch = matches.length === 1 ? matches[0] : null;

  return (
    <div className="w-full rounded-[2rem] border border-[#d5bb92]/55 bg-[#fbf1df]/96 p-5 shadow-[0_18px_50px_rgba(45,12,14,0.18)] sm:p-7">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="请输入您的名字或名字首字母"
          autoComplete="name"
          enterKeyHint="search"
          className="h-13 rounded-full border border-[#cfad7d]/80 bg-white px-5 text-center text-base text-[#5a2326] outline-none transition placeholder:text-[#a48663] focus:border-[#ba8d53] focus:ring-3 focus:ring-[#cfad7d]/20"
        />

        <button
          type="submit"
          className="h-13 rounded-full bg-[#6a292c] text-base font-medium text-[#fbf1df] transition hover:bg-[#5a2326] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75"
        >
          查询
        </button>
      </form>

      <div className="mt-5 min-h-28 rounded-[1.5rem] border border-dashed border-[#d7bc94] bg-[#fffaf1] p-4 text-center text-sm text-[#75494c] sm:p-5">
        {error ? <p className="text-[#b4423b]">{error}</p> : null}

        {!error && !searched ? (
          <p>输入姓名、拼音或首字母后即可查询对应桌号。</p>
        ) : null}

        {!error && searched && exactSingleMatch ? (
          <div className="space-y-2">
            <p className="text-sm text-[#8a6762]">{exactSingleMatch.name}</p>
            <p className="text-3xl font-semibold text-[#5a2326]">{exactSingleMatch.table}</p>
          </div>
        ) : null}

        {!error && searched && matches.length > 1 ? (
          <div className="space-y-3">
            <p>找到多位相近宾客，请确认后入座：</p>
            <ul className="space-y-2 text-left">
              {matches.map((match) => (
                <li
                  key={`${match.table}-${match.name}`}
                  className="flex items-center justify-between rounded-2xl bg-[#f8ecd8] px-4 py-3 text-[#5a2326]"
                >
                  <span>{match.name}</span>
                  <span className="font-semibold">{match.table}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!error && searched && matches.length === 0 ? (
          <p>暂时没有查到，请联系现场工作人员帮你确认座位。</p>
        ) : null}
      </div>
    </div>
  );
}
