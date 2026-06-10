import { NextRequest, NextResponse } from 'next/server';

// Never cache: enabled payment methods must reflect admin changes immediately
// (a stale "bankTransfer:true" could let a customer pay a disabled channel).
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';

  try {
    const upstream = await fetch(`${dashboardUrl}/api/v1/payment-config`, {
      cache: 'no-store',
    });
    const data = await upstream.json();
    const response = NextResponse.json(data, { status: upstream.status });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' } },
      { status: 502 }
    );
  }
}
