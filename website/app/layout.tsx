import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seventh Sense Systems — S³',
  description: 'Where Harmony Becomes Intelligence. S³ は、あなたと複数AIの"調和"から、意思決定と実装を自動で編み上げる。',
  openGraph: {
    title: 'Seventh Sense Systems — S³',
    description: 'Where Harmony Becomes Intelligence.',
    type: 'website',
    siteName: 'Seventh Sense Systems',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seventh Sense Systems — S³',
    description: 'Where Harmony Becomes Intelligence.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

