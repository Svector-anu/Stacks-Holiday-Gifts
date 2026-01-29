'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";

// Dynamically import CreateGiftForm with SSR disabled
const CreateGiftForm = dynamic(
  () => import('@/components/CreateGiftForm'),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8">
        <div className="animate-pulse text-4xl mb-4">🎁</div>
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }
);

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
    router.push(`/claim?s=${encodeURIComponent(claimSecret)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">gift</span>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Stacks Gifts
            </span>
          </Link>
          <ConnectWallet />
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-6">gift</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
              Stacks Holiday Gifts
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Send STX to anyone with a shareable link. Perfect for holiday gifts! 🎄
            </p>
          </div>

          {/* Two Columns */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Create Gift */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>✨</span>
                Create a Gift
              </h2>
              <CreateGiftForm />
            </div>

            {/* Claim Gift */}
            <div className="glass rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span>🎅</span>
                Claim a Gift
              </h2>
              <form onSubmit={handleClaim} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Enter Secret Message
                  </label>
                  <input
                    type="text"
                    value={claimSecret}
                    onChange={(e) => {
                      setClaimSecret(e.target.value);
                      setClaimError(null);
                    }}
                    placeholder="abc123..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  {claimError && (
                    <p className="text-red-400 text-sm mt-2">{claimError}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                   Open Gift
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Have a gift link? <Link href="/claim" className="text-orange-400 hover:underline">Go to claim page →</Link>
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold mb-2">Fast & Secure</h3>
              <p className="text-gray-400 text-sm">Built on Stacks blockchain • Btc L2 • for secure STX transfers</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="font-bold mb-2">Shareable Links</h3>
              <p className="text-gray-400 text-sm">Share gifts via secret message - no wallet needed to receive - simple and easy to use</p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🎄</div>
              <h3 className="font-bold mb-2">Holiday Spirit</h3>
              <p className="text-gray-400 text-sm">Perfect for sending crypto gifts this holiday season</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>🎄 Happy Holidays from Stacks Gifts! 🎄</p>
          <p className="mt-2">Powered by Stacks &amp; WalletConnect</p>
        </div>
      </footer>
    </div>
  );
}
