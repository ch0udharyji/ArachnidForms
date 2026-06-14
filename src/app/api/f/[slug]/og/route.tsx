import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const form = await db.form.findUnique({
      where: { slug: params.slug },
      select: { title: true, description: true }
    });

    if (!form) {
      return new Response('Not found', { status: 404 });
    }

    const title = form.title || 'Untitled Form';
    const description = form.description || 'Powered by ArachnidForms';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Subtle Background Elements */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '50%',
              height: '50%',
              background: 'rgba(59, 130, 246, 0.2)',
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10%',
              right: '-10%',
              width: '50%',
              height: '50%',
              background: 'rgba(168, 85, 247, 0.2)',
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 10,
              maxWidth: '80%',
            }}
          >
            {/* Using the logo image */}
            <img 
              src={process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/logo.png` : 'http://localhost:3000/logo.png'} 
              width="100" 
              height="100" 
              alt="Logo" 
              style={{ marginBottom: '30px' }}
            />
            
            <h1
              style={{
                fontSize: '64px',
                fontWeight: '900',
                marginBottom: '20px',
                lineHeight: 1.1,
                background: 'linear-gradient(to right, #ffffff, #a1a1aa)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {title}
            </h1>
            
            <p
              style={{
                fontSize: '32px',
                fontWeight: '500',
                color: '#a1a1aa',
                marginBottom: '40px',
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.1)',
                padding: '12px 24px',
                borderRadius: '99px',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>ArachnidForms</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('Error generating OG image:', e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
