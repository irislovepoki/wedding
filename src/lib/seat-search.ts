import { pinyin } from "pinyin-pro";
import { seatTables } from "@/content/seat-directory";

export type SeatSearchMatch = {
  name: string;
  table: string;
};

type NormalizedSeatRecord = SeatSearchMatch & {
  order: number;
  normalizedName: string;
  normalizedKeywords: string[];
};

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function buildPinyinKeywords(value: string): string[] {
  const plainPinyin = pinyin(value, {
    mode: "surname",
    surname: "head",
    nonZh: "removed",
    toneType: "none",
    type: "array",
  })
    .join("")
    .toLowerCase();

  const initials = pinyin(value, {
    mode: "surname",
    surname: "head",
    nonZh: "removed",
    pattern: "first",
    toneType: "none",
    type: "array",
  })
    .join("")
    .toLowerCase();

  return [plainPinyin, initials].filter(Boolean);
}

const seatRecords: NormalizedSeatRecord[] = seatTables.flatMap((table, tableIndex) =>
  table.guests.map((guest, guestIndex) => ({
    name: guest.name,
    table: table.table,
    order: tableIndex * 100 + guestIndex,
    normalizedName: normalizeSearchValue(guest.name),
    normalizedKeywords: Array.from(
      new Set([...buildPinyinKeywords(guest.name), ...(guest.keywords ?? []).map(normalizeSearchValue)]),
    ),
  })),
);

function scoreRecord(record: NormalizedSeatRecord, query: string): number {
  if (record.normalizedName === query || record.normalizedKeywords.includes(query)) {
    return 300;
  }

  if (
    record.normalizedName.startsWith(query) ||
    record.normalizedKeywords.some((keyword) => keyword.startsWith(query))
  ) {
    return 200;
  }

  if (
    record.normalizedName.includes(query) ||
    record.normalizedKeywords.some((keyword) => keyword.includes(query))
  ) {
    return 100;
  }

  return 0;
}

export function searchSeatAssignments(query: string): SeatSearchMatch[] {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return [];
  }

  return seatRecords
    .map((record) => ({
      ...record,
      score: scoreRecord(record, normalizedQuery),
    }))
    .filter((record) => record.score > 0)
    .sort((left, right) => right.score - left.score || left.order - right.order)
    .map(({ name, table }) => ({ name, table }));
}
