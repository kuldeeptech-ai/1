
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Function to determine if a URL is for a video stream
const isStreamUrl = (url: string): boolean => {
  return url.includes('.m3u8') || url.includes('master.m3u8');
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Referer': new URL(url).origin
        }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch the URL: ${response.statusText}` }, { status: response.status });
    }

    let html = await response.text();
    const $ = cheerio.load(html);
    
    // Remove specific ad/tracker scripts
    $('script[src*="bvtpk.com"]').remove();
    $('script[src*="tzegilo.com/stattag.js"]').remove();
    $('script[src*="hdstream4u.com/ad"]').remove();

    // Inject CSS to hide specific elements
    $('head').prepend('<style>.header, .download, .nav, .tab, .tab-content, .nav, .rating, .footer{ display: none !important; } .section{padding:2px;}</style>');

    const origin = new URL(url).origin;
    if ($('base').length === 0) {
      $('head').prepend(`<base href="${origin}">`);
    }

    // Find and rewrite video stream URLs
    $('script').each((_, script) => {
        const scriptContent = $(script).html();
        if (scriptContent) {
            const urlRegex = /https?:\/\/[^\s'"]+/g;
            let newScriptContent = scriptContent;
            
            const matches = scriptContent.match(urlRegex);
            if(matches) {
                matches.forEach(foundUrl => {
                    if (isStreamUrl(foundUrl)) {
                        // The URL is inside quotes, so we need to handle that
                        const originalUrlInScript = `'${foundUrl}'` // or `"${foundUrl}"`
                        const proxiedUrl = `/api/stream/${encodeURIComponent(foundUrl)}`;
                        const proxiedUrlInScript = `'${proxiedUrl}'`;
                        newScriptContent = newScriptContent.replace(originalUrlInScript, proxiedUrlInScript);
                    }
                });
            }
             $(script).html(newScriptContent);
        }
    });
    
    // Return the modified HTML
    return new NextResponse($.html(), {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Failed to scrape the page', details: error.message }, { status: 500 });
  }
}
