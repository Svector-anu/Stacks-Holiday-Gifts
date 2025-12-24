'use client';

import { useWallet } from '@/context/WalletContext';

export default function ConnectWallet() {
    const { isConnected, address, connect, disconnect } = useWallet();

    if (isConnected && address) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300 hidden sm:inline">
                    {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={connect}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/20"
        >
            Connect Wallet
        </button>
    );
}
