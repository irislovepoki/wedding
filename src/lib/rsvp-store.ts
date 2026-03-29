import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type RSVPSubmission = {
  name: string;
  guests: number;
  submittedAt: string;
};

type SupabaseRSVPRow = {
  name: string;
  guests: number;
  submitted_at: string;
};

type RSVPStorageInfo = {
  mode: "local" | "supabase";
  label: string;
};

const RSVP_DIRECTORY = path.join(process.cwd(), "data");
const RSVP_FILE = path.join(RSVP_DIRECTORY, "rsvp-submissions.json");
const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const SUPABASE_RSVP_TABLE = process.env.SUPABASE_RSVP_TABLE?.trim() || "rsvp_submissions";

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

function getSupabaseEndpoint() {
  if (!SUPABASE_URL) {
    return null;
  }

  return new URL(`/rest/v1/${SUPABASE_RSVP_TABLE}`, SUPABASE_URL).toString();
}

function getStorageInfo(): RSVPStorageInfo {
  if (hasSupabaseConfig) {
    return {
      mode: "supabase",
      label: `Supabase table: ${SUPABASE_RSVP_TABLE}`,
    };
  }

  return {
    mode: "local",
    label: RSVP_FILE,
  };
}

function mapSupabaseRow(row: SupabaseRSVPRow): RSVPSubmission {
  return {
    name: row.name,
    guests: row.guests,
    submittedAt: row.submitted_at,
  };
}

async function readSupabaseSubmissions(): Promise<RSVPSubmission[]> {
  const endpoint = getSupabaseEndpoint();
  if (!endpoint || !SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const url = new URL(endpoint);
  url.searchParams.set("select", "name,guests,submitted_at");
  url.searchParams.set("order", "submitted_at.desc");

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase read failed: ${response.status}`);
  }

  const rows = (await response.json()) as SupabaseRSVPRow[];
  return rows.map(mapSupabaseRow);
}

async function appendSupabaseSubmission(submission: RSVPSubmission): Promise<RSVPSubmission[]> {
  const endpoint = getSupabaseEndpoint();
  if (!endpoint || !SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify([
      {
        name: submission.name,
        guests: submission.guests,
        submitted_at: submission.submittedAt,
      },
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase write failed: ${response.status}`);
  }

  return readSupabaseSubmissions();
}

export async function readRSVPSubmissions(): Promise<RSVPSubmission[]> {
  if (hasSupabaseConfig) {
    return readSupabaseSubmissions();
  }

  try {
    const raw = await readFile(RSVP_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RSVPSubmission[]) : [];
  } catch {
    return [];
  }
}

export async function appendRSVPSubmission(
  submission: RSVPSubmission,
): Promise<RSVPSubmission[]> {
  if (hasSupabaseConfig) {
    return appendSupabaseSubmission(submission);
  }

  const existing = await readRSVPSubmissions();
  const next = [submission, ...existing];

  await mkdir(RSVP_DIRECTORY, { recursive: true });
  await writeFile(RSVP_FILE, JSON.stringify(next, null, 2), "utf8");

  return next;
}

export const rsvpFilePath = RSVP_FILE;
export const rsvpStorageInfo = getStorageInfo();
