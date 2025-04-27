'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import Image from 'next/image';

type ResultItem = {
  title: string;
  url: string;
};

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [visibleResults, setVisibleResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState('');
  const [loading, startTransition] = useTransition();
  const [searched, setSearched] = useState(false);
  const loadIndexRef = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setError('');
    setSearched(true);
    setResults([]);
    setVisibleResults([]);
    loadIndexRef.current = 0;

    startTransition(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('検索に失敗');

        const json = await res.json();
        setResults(json.results);
      } catch (err) {
        console.error(err);
        setError('検索エラーが発生しました。');
      }
    });
  }

  // IntersectionObserverで次々ロード
  useEffect(() => {
    if (!results.length) return;

    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const next = loadIndexRef.current + 5;
        setVisibleResults(results.slice(0, next));
        loadIndexRef.current = next;
      }
    });

    const sentinel = document.querySelector('#sentinel');
    if (sentinel) observer.observe(sentinel);

    observerRef.current = observer;
  }, [results]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-black transition-colors">
      {/* ロゴ */}
      <Image src="/logo.png" alt="Logo" width={180} height={90} priority className="mb-8" />

      {/* 検索フォーム */}
      <form onSubmit={handleSearch} className="flex w-full max-w-2xl gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="検索"
          className="flex-grow p-3 rounded-full border border-gray-300 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-green-400 text-white rounded-full hover:bg-green-500 transition disabled:opacity-50"
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </form>

      {/* エラー */}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      {/* 結果 */}
      <div className="w-full max-w-2xl mt-10 space-y-4">
        {loading
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            ))
          : visibleResults.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition"
              >
                <h2 className="font-bold text-lg text-blue-600 hover:underline">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.url}</p>
              </a>
            ))}

        {!searched && !loading && results.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            検索ワードを入力してください
          </div>
        )}
      </div>

      {/* ロード監視用 */}
      <div id="sentinel" className="w-full h-1" />
    </main>
  );
}
