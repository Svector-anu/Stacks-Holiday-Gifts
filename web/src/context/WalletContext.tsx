'use client';

import {
    useAppKit,
    useAppKitAccount,
    useDisconnect,
} from '@reown/appkit/react';
import { createContext, useContext, ReactNode } from 'react';

// Network configuration
const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    connect: () => void;
    disconnect: () => void;
    network: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { disconnect: appKitDisconnect } = useDisconnect();

    const connect = () => {
        open();
    };

    const disconnect = () => {
        appKitDisconnect();
    };

    return (
        <WalletContext.Provider
            value={{
                isConnected,
                address: address || null,
                connect,
                disconnect,
                network: NETWORK,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
