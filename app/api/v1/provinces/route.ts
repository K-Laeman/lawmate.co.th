import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';

  try {
    const upstream = await fetch(`${dashboardUrl}/api/v1/provinces`, {
      next: { revalidate: 3600 },
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' } },
      { status: 502 }
    );
  }
}
