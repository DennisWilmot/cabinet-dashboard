import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { meetingAttendance } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const meetingId = req.nextUrl.searchParams.get('meetingId');
  if (!meetingId) {
    return NextResponse.json({ error: 'meetingId required' }, { status: 400 });
  }

  try {
    const row = await db
      .select()
      .from(meetingAttendance)
      .where(eq(meetingAttendance.meetingId, meetingId))
      .limit(1);

    return NextResponse.json({ ministrySlugs: row[0]?.ministrySlugs ?? null });
  } catch {
    return NextResponse.json({ ministrySlugs: null });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { meetingId, ministrySlugs } = body as { meetingId: string; ministrySlugs: string[] };

    if (!meetingId || !Array.isArray(ministrySlugs)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await db
      .insert(meetingAttendance)
      .values({ meetingId, ministrySlugs, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: meetingAttendance.meetingId,
        set: { ministrySlugs, updatedAt: new Date() },
      });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
