'use client';

import { createAppKit } from '@reown/appkit/react';
import { UniversalAdapterClient } from '@reown/appkit-adapter-wagmi';
import { type AppKitNetwork } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';

// Project ID from WalletConnect dashboard
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'efd6780756aafd33f978f50f927e4a34';

// Stacks network configurations
const stacksTestnet: AppKitNetwork = {
    id: 'stacks:testnet',
    name: 'Stacks Testnet',
    nativeCurrency: {
        name: 'STX',
        symbol: 'STX',
        decimals: 6,
    },
    rpcUrls: {
        default: { http: ['https://api.testnet.hiro.so'] },
    },
    blockExplorers: {
        default: { name: 'Stacks Explorer', url: 'https://explorer.stacks.co/?chain=testnet' },
    },
} as AppKitNetwork;

const stacksMainnet: AppKitNetwork = {
    id: 'stacks:mainnet',
    name: 'Stacks Mainnet',
    nativeCurrency: {
        name: 'STX',
        symbol: 'STX',
        decimals: 6,
    },
    rpcUrls: {
        default: { http: ['https://api.hiro.so'] },
    },
    blockExplorers: {
        default: { name: 'Stacks Explorer', url: 'https://explorer.stacks.co' },
    },
} as AppKitNetwork;

const networks = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
    ? [stacksMainnet]
    : [stacksTestnet];

// Metadata for the app
const metadata = {
    name: 'Stacks Holiday Gifts',
    description: 'Send STX gifts to friends and family for the holidays!',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://stacks-holiday-gifts.vercel.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Query client for React Query
const queryClient = new QueryClient();

// Initialize modal on client side only
let modalInitialized = false;

function initializeModal() {
    if (modalInitialized || typeof window === 'undefined') return;

    try {
        createAppKit({
            projectId,
            metadata,
            networks: networks as [AppKitNetwork, ...AppKitNetwork[]],
            features: {
                analytics: true,
                email: false,
                socials: [],
            },
            themeMode: 'dark',
            themeVariables: {
                '--w3m-accent': '#F48024', // Stacks orange
            },
        });
        modalInitialized = true;
    } catch (error) {
        console.error('Failed to initialize AppKit:', error);
    }
}

export function AppKitProvider({ children }: { children: ReactNode }) {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        initializeModal();
        setInitialized(true);
    }, []);

    if (!initialized) {
        return <>{children}</>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
