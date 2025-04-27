import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) return new Response('Missing query', { status: 400 });

  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 KimutichanBot/1.0',
      },
    });

    const html = await res.text();
    const matches = [...html.matchAll(/<a href="\/url\?q=([^"&]+)[^>]*>(.*?)<\/a>/g)];

    const results = matches.slice(0, 10).map((m) => ({
      url: decodeURIComponent(m[1]),
      title: m[2].replace(/<[^>]*>/g, ''),
    }));

    return Response.json({ results });
  } catch (e) {
    console.error(e);
    return new Response('Error fetching search', { status: 500 });
  }
}
