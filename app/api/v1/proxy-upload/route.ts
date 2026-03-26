import { NextRequest, NextResponse } from 'next/server';

// File uploads can be slow on mobile — extend beyond 10s default
export const maxDuration = 30;

export async function PUT(request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';
  const { searchParams } = request.nextUrl;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: { message: 'Missing url parameter' } },
      { status: 400 }
    );
  }

  try {
    const body = await request.arrayBuffer();
    const contentType = request.headers.get('content-type') || 'application/octet-stream';

    const cookie = request.headers.get('cookie') || '';
    const upstream = await fetch(
      `${dashboardUrl}/api/v1/proxy-upload?url=${encodeURIComponent(url)}`,
      {
        method: 'PUT',
        headers: { 'content-type': contentType, cookie },
        body,
        cache: 'no-store',
      }
    );

    return new NextResponse(null, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'ไม่สามารถอัปโหลดไฟล์ได้' } },
      { status: 502 }
    );
  }
}
