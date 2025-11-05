'use client';

import { useEffect, useState } from 'react';

export default function Proofs() {
  const [todayContent, setTodayContent] = useState('今日の入口を読み込み中...');

  useEffect(() => {
    fetch('/today.md')
      .then((res) => {
        if (res.ok) {
          return res.text();
        }
        throw new Error('Failed to fetch');
      })
      .then((text) => setTodayContent(text))
      .catch(() => setTodayContent('今日の入口を読み込めませんでした。'));
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-sm">
          {todayContent || '今日の入口を読み込み中...'}
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <a
            href="https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Raw 今日の入口を表示
          </a>
        </p>
      </div>
    </div>
  );
}

