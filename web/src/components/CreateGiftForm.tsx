'use client';

import { useState } from 'react';
import { request } from '@stacks/connect';
import { useWallet } from '@/context/WalletContext';
import GiftInviteCard from '@/components/GiftInviteCard';
import {
    generateSecret,
    generateGiftLink,
    stxToMicroStx,
    sha256Hash,
    CONTRACT_ADDRESS,
    CONTRACT_NAME,
} from '@/lib/stacks';
import {
    uintCV,
    stringUtf8CV,
    bufferCV,
    cvToHex,
} from '@stacks/transactions';

interface CreateGiftFormProps {
    onGiftCreated?: (giftLink: string, secret: string) => void;
}

export default function CreateGiftForm({ onGiftCreated }: CreateGiftFormProps) {
    const { isConnected, address, balance, connect } = useWallet();
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [giftLink, setGiftLink] = useState<string | null>(null);
    const [giftSecret, setGiftSecret] = useState<string | null>(null);
    const [giftAmount, setGiftAmount] = useState<number>(0);
    const [giftMessage, setGiftMessage] = useState<string>('');
    const [txId, setTxId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            setError('Please connect your wallet first');
            return;
        }

        setIsCreating(true);
        setError(null);

        try {
            const secret = generateSecret();
            const amountNum = parseFloat(amount);

            if (isNaN(amountNum) || amountNum <= 0) {
                setError('⚠️ Please enter a valid amount greater than 0');
                setIsCreating(false);
                return;
            }

            // Check if user has enough balance (including 0.5% fee)
            const feeAmount = amountNum * 0.005;
            const totalNeeded = amountNum + feeAmount;

            if (balance !== null && balance < totalNeeded) {
                setError(`❌ Insufficient balance. You need ${totalNeeded.toFixed(6)} STX (including 0.5% fee) but only have ${balance.toFixed(6)} STX`);
                setIsCreating(false);
                return;
            }

            const amountMicroStx = stxToMicroStx(amountNum);

            // Hash the secret for the contract
            const encoder = new TextEncoder();
            const secretData = encoder.encode(secret);
            const paddedData = new Uint8Array(32);
            paddedData.set(secretData.slice(0, 32));
            const secretHash = await sha256Hash(paddedData);

            // Use @stacks/connect request method for contract call
            // postConditionMode: 'allow' permits STX transfers without explicit post-conditions
            const response = await request('stx_callContract', {
                contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
                functionName: 'create-gift',
                functionArgs: [
                    cvToHex(uintCV(amountMicroStx)),
                    cvToHex(stringUtf8CV(message || 'Happy Holidays! 🎁')),
                    cvToHex(bufferCV(secretHash)),
                ],
                postConditionMode: 'allow',
            });

            if (response && response.txid) {
                // Gift created successfully - use timestamp as temp giftId
                const giftId = Date.now();
                const link = generateGiftLink(giftId, secret);

                setTxId(response.txid);
                setGiftLink(link);
                setGiftSecret(secret);
                setGiftAmount(amountNum);
                setGiftMessage(message);
                onGiftCreated?.(link, secret);
            } else {
                setError('Transaction was not completed');
            }

            setIsCreating(false);
        } catch (err: unknown) {
            console.error('Failed to create gift:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to create gift. Please try again.';
            setError(errorMessage);
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

    if (giftLink && giftSecret) {
        return (
            <div>
                <GiftInviteCard
                    giftId={Date.now()}
                    secret={giftSecret}
                    amount={giftAmount}
                    message={giftMessage}
                    txId={txId || undefined}
                />
                <div className="text-center mt-6">
                    <button
                        onClick={() => {
                            setGiftLink(null);
                            setGiftSecret(null);
                            setGiftAmount(0);
                            setGiftMessage('');
                            setTxId(null);
                            setAmount('');
                            setMessage('');
                        }}
                        className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
                    >
                        Create Another Gift 🎁
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
                    '🎁 Create Gift Pack'
                )}
            </button>
        </form>
    );
}
