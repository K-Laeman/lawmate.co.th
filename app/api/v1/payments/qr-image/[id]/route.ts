import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';

  try {
    const upstream = await fetch(
      `${dashboardUrl}/api/v1/payments/qr-image/${id}`,
      { cache: 'no-store' }
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, error: { message: 'ไม่พบ QR Code' } },
        { status: upstream.status }
      );
    }

    // Forward the image response with correct content-type
    const contentType = upstream.headers.get('content-type') || 'image/png';
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { message: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้' } },
      { status: 502 }
    );
  }
}
