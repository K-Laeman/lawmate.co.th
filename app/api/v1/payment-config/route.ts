import { NextRequest, NextResponse } from 'next/server';

// Cache at Vercel Edge CDN — payment config changes infrequently
export const revalidate = 3600;

export async function GET(_request: NextRequest) {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';

  try {
    const upstream = await fetch(`${dashboardUrl}/api/v1/payment-config`, {
      next: { revalidate: 3600 },
    });
    const data = await upstream.json();
    const response = NextResponse.json(data, { status: upstream.status });
    // Cache at browser + CDN — bank info rarely changes
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' } },
      { status: 502 }
    );
  }
}
