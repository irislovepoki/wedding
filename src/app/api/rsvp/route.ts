import { appendRSVPSubmission, readRSVPSubmissions } from "@/lib/rsvp-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const submissions = await readRSVPSubmissions();
  return Response.json({ submissions });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    guests?: number;
  };

  const name = body.name?.trim();
  const guests = Number(body.guests);

  if (!name) {
    return Response.json({ error: "请输入姓名" }, { status: 400 });
  }

  if (!Number.isFinite(guests) || guests < 1 || guests > 20) {
    return Response.json({ error: "请输入正确的出席人数" }, { status: 400 });
  }

  const submission = {
    name,
    guests,
    submittedAt: new Date().toISOString(),
  };

  await appendRSVPSubmission(submission);

  return Response.json({ ok: true, submission });
}
