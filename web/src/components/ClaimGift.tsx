'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { claimGift } from '@/lib/stacks';

interface ClaimGiftProps {
    giftId: number;
    secret: string;
    message?: string;
    amount?: number;
}

export default function ClaimGift({ giftId, secret, message, amount }: ClaimGiftProps) {
    const { isConnected, address, connect } = useWallet();
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [txId, setTxId] = useState<string | null>(null);

    const handleClaim = async () => {
        if (!address) return;

        setIsClaiming(true);
        setError(null);

        try {
            await claimGift(
                giftId,
                secret,
                (txId) => {
                    setTxId(txId);
                    setClaimed(true);
                    setIsClaiming(false);
                },
                () => {
                    setError('Transaction cancelled');
                    setIsClaiming(false);
                }
            );
        } catch (err) {
            setError('Failed to claim gift. It may have already been claimed.');
            setIsClaiming(false);
        }
    };

    if (claimed) {
        return (
            <div className="text-center py-8">
                <div className="text-8xl mb-6 animate-bounce">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-4">Gift Claimed!</h2>
                <p className="text-gray-400 mb-6">
                    Your gift has been sent to your wallet.
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
            </div>
        );
    }

    return (
        <div className="text-center">
            {/* Gift Card */}
            <div className="relative bg-gradient-to-br from-red-600 to-orange-600 rounded-3xl p-8 mb-8 shadow-2xl overflow-hidden">
                {/* Santa Hat Decoration */}
                <div className="absolute -top-4 -right-4 text-6xl transform rotate-12">🎅</div>

                {/* Snowflakes */}
                <div className="absolute top-4 left-4 text-2xl opacity-50">❄️</div>
                <div className="absolute bottom-4 right-8 text-xl opacity-50">❄️</div>

                <div className="relative z-10">
                    <div className="text-7xl mb-4">🎁</div>
                    <h2 className="text-2xl font-bold text-white mb-2">You&apos;ve Received a Gift!</h2>
                    {amount && (
                        <p className="text-4xl font-bold text-white mb-4">
                            {amount} STX
                        </p>
                    )}
                    {message && (
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                            <p className="text-white/90 italic">&quot;{message}&quot;</p>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm mb-6">
                    {error}
                </div>
            )}

            {!isConnected ? (
                <div>
                    <p className="text-gray-400 mb-4">Connect your wallet to claim this gift</p>
                    <button
                        onClick={connect}
                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold text-lg shadow-lg shadow-orange-500/20"
                    >
                        Connect Wallet
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
                >
                    {isClaiming ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Opening Gift...
                        </span>
                    ) : (
                        '🎁 Open Gift'
                    )}
                </button>
            )}
        </div>
    );
}
