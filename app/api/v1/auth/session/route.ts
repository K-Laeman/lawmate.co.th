import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/v1/auth/session
 * Same-origin proxy to check user session from the dashboard app.
 * Used by the Header component on client-side navigation.
 */
export async function GET() {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    if (!cookieHeader) {
      return NextResponse.json({ user: null });
    }

    const res = await fetch(`${dashboardUrl}/api/v1/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ user: null });
    }

    const data = await res.json();
    return NextResponse.json({ user: data.user ?? null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
