'use client';

import { useState, useEffect } from 'react';

interface OverdriveProof {
  title: string;
  original: string;
  generated: {
    x_post?: string;
    instagram_caption?: string;
  };
  timestamp: string;
}

export default function OverdrivePage() {
  const [proofs, setProofs] = useState<OverdriveProof[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Public Mirrorから最新のProofを取得
    fetch('https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md')
      .then(res => res.text())
      .then(text => {
        // Proofのリンクを抽出（簡易実装）
        const lines = text.split('\n');
        const overdriveProofs = lines
          .filter(line => line.includes('Overdrive_'))
          .slice(0, 5)
          .map((line, i) => ({
            title: `AI Overdrive #${i + 1}`,
            original: 'Your words...',
            generated: {
              x_post: 'AI transformed content for X...',
              instagram_caption: 'AI transformed content for Instagram...'
            },
            timestamp: new Date().toISOString()
          }));
        setProofs(overdriveProofs);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-indigo-900 to-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen p-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI Overdrive
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-center max-w-3xl text-gray-300">
          あなたの一言をAIが全SNSへ展開。<br />
          創造の自動化を超えた<strong className="text-white">"発信の覚醒"</strong>
        </p>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl">
          ターゲット：コーチ・コンサル・セラピスト・カウンセラー
        </p>
        <a
          href="https://lin.ee/XXXXXXX"
          className="mt-10 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
        >
          β版に参加する
        </a>
      </section>

      {/* Features Section */}
      <section className="py-20 px-10 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">機能</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'LINE→全SNS自動配信', icon: '📱' },
            { title: 'GPT/Claudeによる思想変換', icon: '🤖' },
            { title: 'Mirror Gateで証跡化', icon: '🔒' },
            { title: 'あなたの言葉がAIで資産化', icon: '💎' }
          ].map((feature, i) => (
            <div key={i} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Proofs Section */}
      <section className="py-20 px-10 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">実績（最新投稿）</h2>
        {loading ? (
          <div className="text-center text-gray-400">読み込み中...</div>
        ) : proofs.length > 0 ? (
          <div className="space-y-6">
            {proofs.map((proof, i) => (
              <div key={i} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-2xl font-semibold mb-4">{proof.title}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-gray-400 mb-2">元の言葉</h4>
                    <p className="text-gray-300">{proof.original}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">X投稿</h4>
                      <p className="text-sm text-gray-300">{proof.generated.x_post}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Instagram</h4>
                      <p className="text-sm text-gray-300">{proof.generated.instagram_caption}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            まだ実績がありません。β版に参加して最初の投稿をしてみましょう！
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-20 px-10 text-center">
        <h2 className="text-4xl font-bold mb-6">AI Overdriveで、発信を覚醒させる</h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          あなたの言葉が、AIによって全SNSへ自動展開されます。<br />
          すべての記録はMirror Gateで証跡化され、資産として残ります。
        </p>
        <a
          href="https://lin.ee/XXXXXXX"
          className="inline-block bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl"
        >
          β版に参加する
        </a>
      </section>
    </main>
  );
}

