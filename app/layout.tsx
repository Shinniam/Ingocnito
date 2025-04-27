import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'inc0gnit0',
  description: '爆速検索エンジン inc0gnit0',
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
