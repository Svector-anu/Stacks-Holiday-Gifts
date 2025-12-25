'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { request } from '@stacks/connect';
import { useWallet } from '@/context/WalletContext';
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";
import {
    cvToHex,
    CONTRACT_ADDRESS,
    CONTRACT_NAME,
} from '@/lib/stacks';
import {
    uintCV,
    bufferCV,
} from '@stacks/transactions';

export default function ClaimPage() {
    const searchParams = useSearchParams();
    const secretFromUrl = searchParams.get('s') || '';
    const { isConnected, address, connect } = useWallet();

    const [secret, setSecret] = useState(secretFromUrl);
    const [giftId, setGiftId] = useState('0'); // Default to 0 for now
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [txId, setTxId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (secretFromUrl) {
            setSecret(secretFromUrl);
        }
    }, [secretFromUrl]);

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address || !secret.trim()) return;

        setIsClaiming(true);
        setError(null);

        try {
            // Prepare secret for contract
            const encoder = new TextEncoder();
            const secretData = encoder.encode(secret);
            const paddedSecret = new Uint8Array(32);
            paddedSecret.set(secretData.slice(0, 32));

            // Call claim-gift via @stacks/connect
            const response = await request('stx_callContract', {
                contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
                functionName: 'claim-gift',
                functionArgs: [
                    cvToHex(uintCV(parseInt(giftId) || 0)),
                    cvToHex(bufferCV(paddedSecret)),
                ],
            });

            if (response && response.txid) {
                setTxId(response.txid);
                setClaimed(true);
            } else {
                setError('Transaction was not completed');
            }
            setIsClaiming(false);
        } catch (err: unknown) {
            console.error('Failed to claim gift:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to claim. The gift may have already been claimed.';
            setError(errorMessage);
            setIsClaiming(false);
        }
    };

    if (claimed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-8xl mb-6 animate-bounce">🎉</div>
                    <h2 className="text-3xl font-bold text-white mb-4">Gift Claimed!</h2>
                    <p className="text-gray-400 mb-6">
                        Your STX has been sent to your wallet.
                    </p>
                    {txId && (
                        <a
                            href={`https://explorer.stacks.co/txid/${txId}?chain=testnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-400 hover:text-orange-300 underline"
                        >
                            View Transaction →
                        </a>
                    )}
                    <div className="mt-8">
                        <Link href="/" className="text-gray-400 hover:text-white">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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

            {/* Main */}
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-xl mx-auto">
                    <Link href="/" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
                        ← Back
                    </Link>

                    {/* Gift Card */}
                    <div className="relative bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden">
                        <div className="absolute -top-4 -right-4 text-6xl transform rotate-12">🎅</div>
                        <div className="absolute top-4 left-4 text-2xl opacity-50">❄️</div>

                        <div className="relative z-10 text-center">
                            <div className="text-7xl mb-4">🎁</div>
                            <h2 className="text-2xl font-bold text-white">You&apos;ve Received a Gift!</h2>
                        </div>
                    </div>

                    {/* Claim Form */}
                    <div className="glass rounded-3xl p-8">
                        <h2 className="text-xl font-bold mb-4">Claim Your Gift</h2>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm mb-4">
                                {error}
                            </div>
                        )}

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
                            <form onSubmit={handleClaim} className="space-y-4">
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
                                    type="submit"
                                    disabled={isClaiming || !secret.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
                                >
                                    {isClaiming ? 'Claiming...' : '🎁 Open Gift'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
