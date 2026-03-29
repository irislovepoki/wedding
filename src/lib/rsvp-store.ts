import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type RSVPSubmission = {
  name: string;
  guests: number;
  submittedAt: string;
};

const RSVP_DIRECTORY = path.join(process.cwd(), "data");
const RSVP_FILE = path.join(RSVP_DIRECTORY, "rsvp-submissions.json");

export async function readRSVPSubmissions(): Promise<RSVPSubmission[]> {
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
  const existing = await readRSVPSubmissions();
  const next = [submission, ...existing];

  await mkdir(RSVP_DIRECTORY, { recursive: true });
  await writeFile(RSVP_FILE, JSON.stringify(next, null, 2), "utf8");

  return next;
}

export const rsvpFilePath = RSVP_FILE;
