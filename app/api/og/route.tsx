import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#0f172a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Arial, sans-serif',
          height: '100%',
          justifyContent: 'center',
          padding: 72,
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: 24,
            color: '#0f172a',
            display: 'flex',
            fontSize: 56,
            fontWeight: 700,
            height: 112,
            justifyContent: 'center',
            marginBottom: 40,
            width: 112,
          }}
        >
          LM
        </div>
        <div
          style={{
            color: '#ffffff',
            display: 'flex',
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          LawMate
        </div>
        <div
          style={{
            color: '#bfdbfe',
            display: 'flex',
            fontSize: 32,
            lineHeight: 1.35,
            maxWidth: 820,
            textAlign: 'center',
          }}
        >
          Online legal consultation platform in Thailand
        </div>
        <div
          style={{
            background: '#2563eb',
            borderRadius: 999,
            display: 'flex',
            height: 6,
            marginBottom: 32,
            marginTop: 40,
            width: 96,
          }}
        />
        <div
          style={{
            color: '#94a3b8',
            display: 'flex',
            fontSize: 26,
          }}
        >
          lawmate.co.th
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
