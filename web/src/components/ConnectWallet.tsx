'use client';

import { useWallet } from '@/context/WalletContext';

export default function ConnectWallet() {
    const { isConnected, address, balance, isLoadingBalance, connect, disconnect } = useWallet();

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-3">
                {/* Balance Display */}
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs text-gray-400">Balance</span>
                    <span className="text-sm font-semibold text-orange-400">
                        {isLoadingBalance ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : balance !== null ? (
                            `${balance.toFixed(2)} STX`
                        ) : (
                            '-- STX'
                        )}
                    </span>
                </div>

                {/* Address Display */}
                <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-mono">
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                </div>

                {/* Disconnect Button */}
                <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={connect}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg shadow-orange-500/20"
        >
            Connect Wallet
        </button>
    );
}
