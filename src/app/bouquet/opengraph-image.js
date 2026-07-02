import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'A Digital Bouquet for You';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ searchParams }) {
  const encoded = searchParams?.d;
  let recipientName = 'You';
  let senderName = 'Someone Special';
  let occasion = '';
  let flowerCount = 0;

  if (encoded) {
    try {
      // Try pako-compressed first, then plain base64
      let json;
      try {
        const binary = atob(encoded);
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        // Check if it looks like deflate data (first byte is usually 0x78)
        if (bytes[0] === 0x78) {
          // Can't use pako in edge, try basic decode
          throw new Error('compressed');
        }
        json = decodeURIComponent(escape(atob(encoded)));
      } catch {
        json = decodeURIComponent(escape(atob(encoded)));
      }
      const data = JSON.parse(json);
      recipientName = data.c?.recipientName || 'You';
      senderName = data.c?.senderName || 'Someone Special';
      flowerCount = data.f?.length || 0;
      occasion = data.o || '';
    } catch {
      // Fallback to defaults
    }
  }

  const occasionEmojis = {
    birthday: '🎂',
    thankyou: '🙏',
    getwell: '💝',
    justbecause: '💐',
    congratulations: '🎉',
    apology: '🕊️',
    love: '❤️',
    anniversary: '💍',
    mothersday: '👩',
    graduation: '🎓',
  };

  const emoji = occasionEmojis[occasion] || '💐';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #faf8f5 0%, #fff0f5 50%, #faf8f5 100%)',
          fontFamily: 'serif',
        }}
      >
        {/* Decorative flowers */}
        <div style={{ fontSize: 80, marginBottom: 8, display: 'flex', gap: 16 }}>
          🌸🌷🌹🌻🌺
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            color: '#2d2a26',
            marginBottom: 8,
            fontStyle: 'italic',
          }}
        >
          A Bouquet for {recipientName}
        </div>

        {/* Occasion */}
        {occasion && (
          <div
            style={{
              fontSize: 28,
              color: '#e84057',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {emoji} {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
          </div>
        )}

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#2d2a2680',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          {flowerCount > 0 ? `${flowerCount} blooms` : 'Digital Bouquet'} from {senderName}
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 20,
            color: '#2d2a2640',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Bloomshire
        </div>
      </div>
    ),
    { ...size }
  );
}
