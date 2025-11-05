import Proofs from './@sections/Proofs';
import Navigator from '@/components/Navigator';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Seventh Sense Systems
        </h1>
        <p className="text-2xl md:text-3xl text-gray-600 mb-8">
          Where Harmony Becomes Intelligence.
        </p>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
          S³ は、あなたと複数AIの"調和"から、意思決定と実装を自動で編み上げる。
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="#capabilities"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Learn More
          </a>
          <a
            href="#cta"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Get Early Access
          </a>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Capabilities
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Harmony</h3>
              <p className="text-gray-600">
                複数のAIが協調し、最適な解を導き出す。
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Intelligence</h3>
              <p className="text-gray-600">
                構造から意識へ。6から7への転化。
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Automation</h3>
              <p className="text-gray-600">
                意思決定から実装まで、自動で編み上げる。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proofs Section */}
      <section id="proofs" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            今日の入口（Public Mirror）
          </h2>
          <Proofs />
        </div>
      </section>

      {/* Navigator Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ナビゲーターAI
          </h2>
          <Navigator />
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Get Early Access</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          S³ Systems のベータ版に参加し、叡智の呼吸を体験してください。
        </p>
        <form className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">S³ Systems</h3>
              <p className="text-sm">
                Where Harmony Becomes Intelligence.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/kyousuke10000/TriHexPhi-public"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Public Mirror (GitHub)
                  </a>
                </li>
                <li>
                  <a
                    href="https://raw.githubusercontent.com/kyousuke10000/TriHexPhi-public/main/index.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Raw 今日の入口
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Documentation</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/kyousuke10000/TriHexPhi/blob/main/50_CHL/docs/vision.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Vision
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/kyousuke10000/TriHexPhi/blob/main/50_CHL/docs/brand.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    Brand
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Seventh Sense Systems. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

