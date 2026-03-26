import { NextRequest, NextResponse } from 'next/server';

// Consultation creation involves Omise API + DB write — needs headroom beyond 10s default
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';
  const { searchParams } = request.nextUrl;

  // Forward auth cookie if present
  const cookie = request.headers.get('cookie') || '';

  try {
    const upstream = await fetch(
      `${dashboardUrl}/api/v1/consultations?${searchParams.toString()}`,
      {
        headers: { cookie },
        cache: 'no-store',
      }
    );
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' } },
      { status: 502 }
    );
  }
}

export async function POST(request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';

  try {
    const body = await request.text();
    const cookie = request.headers.get('cookie') || '';

    const upstream = await fetch(`${dashboardUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie,
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      },
      body,
      cache: 'no-store',
    });

    const data = await upstream.json();

    // Strip guestAuth from JS-visible body, set as httpOnly cookies so guest can upload slip
    let guestAuth: { accessToken: string; refreshToken: string } | null = null;
    if (data.data?.guestAuth) {
      guestAuth = data.data.guestAuth;
      delete data.data.guestAuth;
    }

    const response = NextResponse.json(data, { status: upstream.status });

    if (guestAuth) {
      const isProd = process.env.NODE_ENV === 'production';
      response.cookies.set('lawmate-auth', guestAuth.accessToken, {
        httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 15 * 60,
      });
      response.cookies.set('lawmate-refresh', guestAuth.refreshToken, {
        httpOnly: true, secure: isProd, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' } },
      { status: 502 }
    );
  }
}
