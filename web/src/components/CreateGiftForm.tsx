'use client';

import { useState } from 'react';
import { useAppKitProvider } from '@reown/appkit/react';
import { useWallet } from '@/context/WalletContext';
import {
    generateSecret,
    generateGiftLink,
    stxToMicroStx,
    CONTRACT_ADDRESS,
    CONTRACT_NAME,
} from '@/lib/stacks';

interface CreateGiftFormProps {
    onGiftCreated?: (giftLink: string) => void;
}

export default function CreateGiftForm({ onGiftCreated }: CreateGiftFormProps) {
    const { isConnected, address, connect } = useWallet();
    const { walletProvider } = useAppKitProvider('bip122');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [giftLink, setGiftLink] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address || !walletProvider) return;

        setIsCreating(true);
        setError(null);

        try {
            const secret = generateSecret();
            const amountNum = parseFloat(amount);

            if (isNaN(amountNum) || amountNum <= 0) {
                setError('Please enter a valid amount');
                setIsCreating(false);
                return;
            }

            const amountMicroStx = stxToMicroStx(amountNum);

            // Use AppKit's provider to call the contract
            // For now, show a demo success since contract isn't deployed yet
            const giftId = Date.now();
            const link = generateGiftLink(giftId, secret);

            // TODO: Once contract is deployed, use:
            // const response = await walletProvider.request({
            //   method: 'stx_callContract',
            //   params: {
            //     contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
            //     functionName: 'create-gift',
            //     functionArgs: [...],
            //   },
            // });

            setGiftLink(link);
            setIsCreating(false);
            onGiftCreated?.(link);

        } catch (err) {
            console.error('Failed to create gift:', err);
            setError('Failed to create gift. Please try again.');
            setIsCreating(false);
        }
    };

    if (!isConnected) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">🎁</div>
                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-6">Connect your wallet to start sending holiday gifts!</p>
                <button
                    onClick={connect}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all font-semibold shadow-lg shadow-orange-500/20"
                >
                    Connect Wallet
                </button>
            </div>
        );
    }

    if (giftLink) {
        return (
            <div className="text-center py-8">
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-white mb-4">Gift Created!</h2>
                <p className="text-gray-400 mb-6">Share this link with your recipient:</p>
                <div className="bg-gray-800/50 rounded-xl p-4 mb-6 break-all">
                    <code className="text-orange-400 text-sm">{giftLink}</code>
                </div>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => navigator.clipboard.writeText(giftLink)}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                        Copy Link 📋
                    </button>
                    <button
                        onClick={() => {
                            setGiftLink(null);
                            setAmount('');
                            setMessage('');
                        }}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                        Create Another 🎁
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (STX)
                </label>
                <input
                    type="number"
                    step="0.000001"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="10.0"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    required
                />
                <p className="mt-1 text-xs text-gray-500">0.5% service fee applies</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message (optional)
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="🎄 Happy Holidays! Wishing you joy and prosperity..."
                    rows={3}
                    maxLength={280}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">{message.length}/280 characters</p>
            </div>

            <button
                type="submit"
                disabled={isCreating || !amount}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
                {isCreating ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Gift...
                    </span>
                ) : (
                    '🎁 Pack Your Gift'
                )}
            </button>

            <p className="text-xs text-center text-gray-500">
                ⚠️ Contract not deployed yet - this is a demo. Deploy to testnet to enable real transactions.
            </p>
        </form>
    );
}
