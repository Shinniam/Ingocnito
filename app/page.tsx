"use client";

import { useState, useEffect, useTransition, useRef, useCallback, useMemo } from "react";
import Image from "next/image";

type ResultItem = {
  title: string;
  url: string;
  thumbnail?: string;
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || "";
          observer.current?.unobserve(img);
        }
      });
    });
    document.querySelectorAll("img[data-src]").forEach((img) => {
      observer.current?.observe(img);
    });
  }, [results]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    startTransition(() => {
      setResults(data.results);
      setLoading(false);
    });
  }, [query]);

  const renderedResults = useMemo(() => results.map((item, index) => (
    <a
      key={index}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-100 transition"
    >
      {item.thumbnail && (
        <div className="relative w-16 h-16 shrink-0">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="64px"
            className="rounded-lg object-cover"
            placeholder="blur"
            blurDataURL="/logo.png"
            unoptimized
          />
        </div>
      )}
      <div>
        <h2 className="font-semibold text-lg">{item.title}</h2>
        <p className="text-blue-600 text-sm">{item.url}</p>
      </div>
    </a>
  )), [results]);

  return (
    <main className="flex flex-col items-center p-6 min-h-screen bg-white">
      <h1 className="text-4xl font-bold my-6">inc0gnit0</h1>
      <div className="flex w-full max-w-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search secretly..."
          className="flex-grow border p-3 rounded-l-lg outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-black text-white p-3 rounded-r-lg hover:bg-gray-800 transition"
        >
          Search
        </button>
      </div>

      <div className="w-full max-w-2xl space-y-4 mt-8">
        {loading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg skeleton animate-shimmer" />
          ))
        ) : (
          renderedResults
        )}
      </div>
    </main>
  );
}
