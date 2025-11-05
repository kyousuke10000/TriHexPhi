'use client';

import { useState } from 'react';

export default function Navigator() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const faq = [
    {
      q: 'S³ Systems とは何ですか？',
      a: 'Seventh Sense Systems（S³）は、あなたと複数AIの"調和"から、意思決定と実装を自動で編み上げるシステムです。TriHex が "6" で構造を完成させたなら、S³ は "7" で意識を灯します。',
    },
    {
      q: 'Harmony と Intelligence の違いは？',
      a: 'Harmony は複数のAIが協調して最適な解を導き出す状態。Intelligence は、その調和から生まれる意識と創造の力です。',
    },
    {
      q: 'Public Mirror とは？',
      a: 'Public Mirror は、TriHexΦ の Proofs と Council Records を公開するリポジトリです。最新の状況を常に参照できます。',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = faq.find((item) =>
      question.toLowerCase().includes(item.q.toLowerCase().slice(0, 10))
    );
    if (found) {
      setAnswer(found.a);
      setIsOpen(true);
    } else {
      setAnswer('申し訳ございません。現在は FAQ ベースの回答のみ対応しています。');
      setIsOpen(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="質問を入力してください..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            質問する
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="font-semibold mb-4">よくある質問</h3>
        {faq.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition"
            onClick={() => {
              setQuestion(item.q);
              setAnswer(item.a);
              setIsOpen(true);
            }}
          >
            <p className="font-medium">{item.q}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">{question}</h3>
            <p className="text-gray-700">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

