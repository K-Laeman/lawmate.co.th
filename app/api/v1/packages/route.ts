import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';
  const { searchParams } = request.nextUrl;

  try {
    const upstream = await fetch(
      `${dashboardUrl}/api/v1/packages?${searchParams.toString()}`,
      { next: { revalidate: 3600 } }
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
