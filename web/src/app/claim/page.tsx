'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useWallet } from '@/context/WalletContext';
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";
import {
    CONTRACT_ADDRESS,
    CONTRACT_NAME,
} from '@/lib/stacks';

// Force dynamic rendering
export const forceDynamic = 'force-dynamic';

// Dynamically import stacks transactions with SSR disabled
const StacksClaim = dynamic(
    () => import('@/components/ClaimGift').then(mod => ({ default: mod.default })),
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

function ClaimContent() {
    const searchParams = useSearchParams();
    const secretFromUrl = searchParams.get('s') || '';
    const { isConnected, address, connect } = useWallet();

    const [secret, setSecret] = useState(secretFromUrl);
    const [giftId, setGiftId] = useState('0');
    const [showClaimComponent, setShowClaimComponent] = useState(false);

    useEffect(() => {
        if (secretFromUrl) {
            setSecret(secretFromUrl);
        }
    }, [secretFromUrl]);

    if (showClaimComponent && secret) {
        return (
            <div className="min-h-screen">
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
                <main className="pt-24 pb-16 px-4">
                    <div className="max-w-xl mx-auto">
                        <StacksClaim
                            giftId={parseInt(giftId) || 0}
                            secret={secret}
                            message="Happy Holidays! 🎄"
                        />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
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

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-xl mx-auto">
                    <Link href="/" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
                        ← Back
                    </Link>

                    <div className="relative bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden">
                        <div className="absolute -top-4 -right-4 text-6xl transform rotate-12">🎅</div>
                        <div className="absolute top-4 left-4 text-2xl opacity-50">❄️</div>

                        <div className="relative z-10 text-center">
                            <div className="text-7xl mb-4">🎁</div>
                            <h2 className="text-2xl font-bold text-white">You&apos;ve Received a Gift!</h2>
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-4">Claim Your Gift</h2>

                        {!isConnected ? (
                            <div className="text-center">
                                <p className="text-gray-400 mb-4">Connect your wallet to claim</p>
                                <button
                                    onClick={connect}
                                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold"
                                >
                                    Connect Wallet
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Gift ID
                                    </label>
                                    <input
                                        type="number"
                                        value={giftId}
                                        onChange={(e) => setGiftId(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Secret Message
                                    </label>
                                    <input
                                        type="text"
                                        value={secret}
                                        onChange={(e) => setSecret(e.target.value)}
                                        placeholder="Enter your secret..."
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                                        required
                                    />
                                </div>
                                <button
                                    onClick={() => setShowClaimComponent(true)}
                                    disabled={!secret.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                                >
                                    🎁 Open Gift
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function ClaimPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🎁</div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        }>
            <ClaimContent />
        </Suspense>
    );
}
