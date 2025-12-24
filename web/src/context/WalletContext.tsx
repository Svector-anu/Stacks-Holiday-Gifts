'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
    connect as stacksConnect,
    disconnect as stacksDisconnect,
    isConnected as stacksIsConnected,
    getLocalStorage,
} from '@stacks/connect';

// Network configuration
const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
    network: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    // Check if already connected on mount
    useEffect(() => {
        const checkConnection = async () => {
            try {
                const connected = stacksIsConnected();
                if (connected) {
                    const storage = getLocalStorage();
                    if (storage?.addresses?.stx) {
                        const addresses = storage.addresses.stx;
                        const addr = addresses.find((a: { symbol: string }) => a.symbol === 'STX');
                        if (addr) {
                            setAddress(addr.address);
                            setIsConnected(true);
                        }
                    }
                }
            } catch (e) {
                console.log('Not connected yet');
            }
        };
        checkConnection();
    }, []);

    const connect = useCallback(async () => {
        try {
            const response = await stacksConnect();
            if (response && response.addresses) {
                const stxAddress = response.addresses.find(
                    (addr: { symbol: string }) => addr.symbol === 'STX'
                );
                if (stxAddress) {
                    setAddress(stxAddress.address);
                    setIsConnected(true);
                }
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    }, []);

    const disconnect = useCallback(() => {
        stacksDisconnect();
        setAddress(null);
        setIsConnected(false);
    }, []);

    return (
        <WalletContext.Provider
            value={{
                isConnected,
                address,
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
