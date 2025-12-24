'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppConfig, showConnect, UserSession } from '@stacks/connect';

// App config for Stacks Connect
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

// Network configuration
const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    connect: () => void;
    disconnect: () => void;
    userSession: UserSession;
    network: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    // Check if already signed in on mount
    React.useEffect(() => {
        if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            const userAddress = NETWORK === 'mainnet'
                ? userData.profile.stxAddress.mainnet
                : userData.profile.stxAddress.testnet;
            setAddress(userAddress);
            setIsConnected(true);
        }
    }, []);

    const connect = useCallback(() => {
        showConnect({
            appDetails: {
                name: 'Stacks Holiday Gifts',
                icon: '/gift-icon.png',
            },
            redirectTo: '/',
            onFinish: () => {
                const userData = userSession.loadUserData();
                const userAddress = NETWORK === 'mainnet'
                    ? userData.profile.stxAddress.mainnet
                    : userData.profile.stxAddress.testnet;
                setAddress(userAddress);
                setIsConnected(true);
            },
            userSession,
        });
    }, []);

    const disconnect = useCallback(() => {
        userSession.signUserOut();
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
                userSession,
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
