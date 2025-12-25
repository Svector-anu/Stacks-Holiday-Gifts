'use client';

import {
    useAppKit,
    useAppKitAccount,
    useDisconnect,
} from '@reown/appkit/react';
import { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';

// Network configuration
const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    balance: number | null;
    isLoadingBalance: boolean;
    connect: () => void;
    disconnect: () => void;
    network: string;
    refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { disconnect: appKitDisconnect } = useDisconnect();
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    const fetchBalance = useCallback(async () => {
        if (!address) {
            setBalance(null);
            return;
        }

        // Only fetch balance for Stacks addresses (start with ST or SP)
        if (!address.startsWith('ST') && !address.startsWith('SP')) {
            console.log('Not a Stacks address, skipping balance fetch:', address);
            setBalance(null);
            return;
        }

        setIsLoadingBalance(true);
        try {
            const apiUrl = NETWORK === 'mainnet'
                ? 'https://api.hiro.so'
                : 'https://api.testnet.hiro.so';

            const response = await fetch(`${apiUrl}/extended/v1/address/${address}/stx`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Validate response has balance field
            if (data && typeof data.balance === 'string') {
                const stxBalance = parseInt(data.balance) / 1_000_000;
                setBalance(stxBalance);
            } else {
                console.error('Invalid balance data:', data);
                setBalance(0);
            }
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            setBalance(0);
        } finally {
            setIsLoadingBalance(false);
        }
    }, [address]);

    useEffect(() => {
        if (isConnected && address) {
            fetchBalance();
        } else {
            setBalance(null);
        }
    }, [isConnected, address, fetchBalance]);

    const connect = useCallback(() => {
        open();
    }, [open]);

    const disconnect = useCallback(() => {
        appKitDisconnect();
        setBalance(null);
    }, [appKitDisconnect]);

    return (
        <WalletContext.Provider
            value={{
                isConnected: isConnected || false,
                address: address || null,
                balance,
                isLoadingBalance,
                connect,
                disconnect,
                network: NETWORK,
                refreshBalance: fetchBalance,
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
