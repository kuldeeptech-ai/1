
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const targetUrl = decodeURIComponent(params.slug.join('/'));

  if (!targetUrl) {
    return new Response('Missing target URL', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Referer': new URL(targetUrl).origin,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return new Response(`Failed to fetch stream: ${response.statusText}`, { status: response.status });
    }

    const isM3U8 = targetUrl.includes('.m3u8');
    
    if (isM3U8) {
      let m3u8Content = await response.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

      // Regex to find relative URLs in the m3u8 file
      const relativeUrlRegex = /^(?!#)(?!https?:\/\/).*/gm;
      m3u8Content = m3u8Content.replace(relativeUrlRegex, (match) => {
        // Prepend our proxy path to the relative URL
        const absoluteUrl = new URL(match, baseUrl).href;
        return `/api/stream/${encodeURIComponent(absoluteUrl)}`;
      });
      
      return new Response(m3u8Content, {
        headers: { 
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
         },
      });

    } else {
        const { body, headers } = response;
        const contentType = headers.get('Content-Type') || 'application/octet-stream';
        
        return new Response(body, {
            headers: {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

  } catch (error) {
    console.error('Streaming proxy error:', error);
    return new Response('Error fetching stream', { status: 500 });
  }
}
