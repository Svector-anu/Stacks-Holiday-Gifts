'use client';

import { useState } from 'react';

interface GiftInviteCardProps {
    giftId: number;
    secret: string;
    amount: number;
    message?: string;
    txId?: string;
}

export default function GiftInviteCard({ giftId, secret, amount, message, txId }: GiftInviteCardProps) {
    const [copied, setCopied] = useState(false);

    const giftUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/claim?s=${encodeURIComponent(secret)}`
        : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(secret);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (platform: 'twitter' | 'telegram') => {
        const text = `🎁 You've received a ${amount} STX gift! ${message ? `"${message}"` : ''}\n\nClaim it here: ${giftUrl}`;

        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        } else {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(giftUrl)}&text=${encodeURIComponent(text)}`, '_blank');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Invite Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 p-1">
                <div className="relative bg-gray-900 rounded-3xl p-8">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4 animate-bounce">🎁</div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                                Gift Created!
                            </h2>
                            <p className="text-gray-400">Share this with your recipient</p>
                        </div>

                        {/* Gift Details */}
                        <div className="glass rounded-2xl p-6 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400">Amount</span>
                                <span className="text-2xl font-bold text-orange-400">{amount} STX</span>
                            </div>

                            {message && (
                                <div className="pt-4 border-t border-gray-700">
                                    <span className="text-gray-400 text-sm">Message</span>
                                    <p className="text-white mt-1 italic">&quot;{message}&quot;</p>
                                </div>
                            )}
                        </div>

                        {/* Secret Code */}
                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">Secret Code</label>
                            <div className="flex gap-2">
                                <div className="flex-1 glass rounded-xl p-4">
                                    <code className="text-orange-400 font-mono text-sm break-all">
                                        {secret}
                                    </code>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all font-medium"
                                >
                                    {copied ? '✓' : '📋'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Share this secret code with your recipient to claim the gift
                            </p>
                        </div>

                        {/* Share Buttons */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button
                                onClick={() => handleShare('twitter')}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all font-medium"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                Share on X
                            </button>
                            <button
                                onClick={() => handleShare('telegram')}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl transition-all font-medium"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                                </svg>
                                Share on Telegram
                            </button>
                        </div>

                        {/* Transaction Link */}
                        {txId && (
                            <div className="text-center">
                                <a
                                    href={`https://explorer.stacks.co/txid/${txId}?chain=testnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                                >
                                    View transaction on explorer →
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Coming Soon Banner */}
            <div className="mt-6 glass rounded-2xl p-4 border border-orange-500/20">
                <div className="flex items-center gap-3">
                    <div className="text-2xl">🚀</div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-white">Coming Soon: Multi-Token Gifts</h3>
                        <p className="text-sm text-gray-400">Gift any SIP-010 token - WELSH, ALEX, and more!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
