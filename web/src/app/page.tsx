'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConnectWallet from "@/components/ConnectWallet";
import CreateGiftForm from "@/components/CreateGiftForm";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [claimSecret, setClaimSecret] = useState('');
  const [claimError, setClaimError] = useState<string | null>(null);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimSecret.trim()) {
      setClaimError('Please enter a secret message');
      return;
    }
    // Navigate to claim page with secret
    router.push(`/claim?s=${encodeURIComponent(claimSecret.trim())}`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Stacks Gifts
            </span>
          </Link>
          <ConnectWallet />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <span className="text-7xl animate-float">🎁</span>
              <span className="absolute -top-4 -right-1 text-3xl transform rotate-12">🎅</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-2 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
              Onchain Gift Pack
            </h1>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Claim Section */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🎁</span>
                Claim a Gift
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Enter the secret message to claim your gift
              </p>

              <form onSubmit={handleClaim} className="space-y-4">
                {claimError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                    {claimError}
                  </div>
                )}
                <input
                  type="text"
                  value={claimSecret}
                  onChange={(e) => {
                    setClaimSecret(e.target.value);
                    setClaimError(null);
                  }}
                  placeholder="Enter secret message..."
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  Claim Gift
                </button>
              </form>
            </div>

            {/* Create Section */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>✨</span>
                Create a Gift
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Create a gift pack to send to someone special
              </p>
              <Link
                href="/create"
                className="block w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-center hover:from-orange-600 hover:to-red-600 transition-all"
              >
                Create Gift Pack
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔗</div>
              <p className="text-xs text-gray-400">Secret Links</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">⏰</div>
              <p className="text-xs text-gray-400">Auto-Refund</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">🔒</div>
              <p className="text-xs text-gray-400">Secure</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <a
            href="https://github.com/Svector-anu/Stacks-Holiday-Gifts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
