import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';
  const cookie = request.headers.get('cookie') || '';

  try {
    const body = await request.json();
    const upstream = await fetch(
      `${dashboardUrl}/api/v1/consultations/${id}/submit-slip`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify(body),
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
