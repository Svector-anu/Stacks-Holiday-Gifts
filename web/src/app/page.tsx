'use client';

import ConnectWallet from "@/components/ConnectWallet";
import CreateGiftForm from "@/components/CreateGiftForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Stacks Holiday Gifts
            </span>
          </Link>
          <ConnectWallet />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <span className="text-8xl animate-float">🎁</span>
              {/* Santa Cap */}
              <span className="absolute -top-6 -right-2 text-4xl transform rotate-12">🎅</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Send STX Gifts
            </h1>
            <p className="text-xl text-gray-400 max-w-lg mx-auto">
              Create shareable gift links and spread holiday joy on the Stacks blockchain!
            </p>
          </div>

          {/* Gift Creation Card */}
          <div className="glass rounded-3xl p-8 holiday-glow">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>✨</span>
              Create a Gift
            </h2>
            <CreateGiftForm />
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="font-semibold mb-2">Shareable Links</h3>
              <p className="text-sm text-gray-400">
                Send gifts via simple links - no wallet needed to receive!
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="font-semibold mb-2">Auto-Refund</h3>
              <p className="text-sm text-gray-400">
                Unclaimed gifts return to you after 14 days
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold mb-2">Secure</h3>
              <p className="text-sm text-gray-400">
                Powered by Bitcoin via Stacks blockchain
              </p>
            </div>
          </div>

          {/* Powered by Section */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">
              Powered by
            </p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="text-orange-400 font-semibold">Stacks</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">Bitcoin L2</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>🎄 Happy Holidays from Stacks Holiday Gifts! 🎄</p>
          <p className="mt-2">
            <a
              href="https://github.com/Svector-anu/Stacks-Holiday-Gifts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300"
            >
              View on GitHub →
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
