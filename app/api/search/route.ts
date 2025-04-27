import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(JSON.stringify({ results: [] }), { status: 400 });
  }

  const dummyResults = Array.from({ length: 5 }).map((_, idx) => ({
    title: `${query} - Result ${idx + 1}`,
    url: "https://example.com",
    thumbnail: "/logo.png",
  }));

  return new Response(JSON.stringify({ results: dummyResults }), {
    headers: { "Content-Type": "application/json" },
  });
}
