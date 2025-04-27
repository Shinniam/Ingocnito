'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ title: string, url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('検索に失敗しました');

      const json = await res.json();
      setResults(json.results);
    } catch (err) {
      console.error(err);
      setError('検索中にエラーが発生しました。');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-green-100 via-white to-white dark:from-gray-900 dark:to-black">
      {/* ロゴ部分 */}
      <div className="mb-8">
        <Image src="/logo.png" alt="Kimutichan" width={200} height={100} priority />
      </div>

      {/* 検索フォーム */}
      <form onSubmit={handleSearch} className="w-full max-w-2xl flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="検索ワードを入力..."
          className="flex-grow p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-green-400 text-white rounded-full hover:bg-green-500 transition"
        >
          検索
        </button>
      </form>

      {/* ローディングアニメ */}
      {loading && (
        <div className="mt-12 flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-green-400 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-green-500">読み込み中...</p>
        </div>
      )}

      {/* エラー表示 */}
      {error && <p className="mt-8 text-red-500">{error}</p>}

      {/* 検索結果 or スケルトンUI */}
      <div className="mt-10 w-full max-w-2xl space-y-4">
        {/* スケルトン表示（読み込み中） */}
        {loading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            ></div>
          ))}

        {/* 結果表示 */}
        {!loading && results.map((item, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-white shadow-md dark:bg-gray-800 transition-all duration-300 hover:shadow-lg"
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.url}</p>
            </a>
          </div>
        ))}

        {/* 最初何もしてないときは非表示 */}
        {!searched && !loading && results.length === 0 && (
          <div className="text-gray-400 text-center mt-8">
            検索ワードを入力してください
          </div>
        )}
      </div>
    </main>
  );
}
