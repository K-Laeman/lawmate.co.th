import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';
  const { searchParams } = request.nextUrl;

  try {
    const upstream = await fetch(
      `${dashboardUrl}/api/v1/lawyers?${searchParams.toString()}`,
      { next: { revalidate: 60 } }
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
