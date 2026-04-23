import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface Payload {
  email?: string;
  teamSize?: string;
  agents?: string;
}

const VALID_TEAM_SIZES = ['solo', '2-5', '6-20', '21-100', '100+'] as const;
type TeamSize = (typeof VALID_TEAM_SIZES)[number];

function isValidTeamSize(value: string | undefined): value is TeamSize {
  return typeof value === 'string' && (VALID_TEAM_SIZES as readonly string[]).includes(value);
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    console.warn('[early-access] 400 invalid JSON', { at: new Date().toISOString() });
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
    console.warn('[early-access] 400 invalid email', { email: body.email, at: new Date().toISOString() });
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }
  if (!isValidTeamSize(body.teamSize)) {
    console.warn('[early-access] 400 invalid teamSize', { email: body.email, at: new Date().toISOString() });
    return NextResponse.json({ error: 'Team size required' }, { status: 400 });
  }

  // TODO: wire to real persistence (Resend / Postgres / etc.)
  // For now, log and accept.
  console.log('[early-access] signup', {
    email: body.email,
    teamSize: body.teamSize,
    agents: body.agents ?? '',
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
