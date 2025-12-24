'use client';

import { createAppKit } from '@reown/appkit/react';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { bitcoin, bitcoinTestnet, stacks, stacksTestnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Project ID from WalletConnect dashboard
const projectId = 'efd6780756aafd33f978f50f927e4a34';

// 1. Setup the Bitcoin Adapter (supports Stacks wallets like Leather & Xverse)
const bitcoinAdapter = new BitcoinAdapter();

// 2. Define networks - Stacks testnet for dev, mainnet for production
const networks = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
    ? [stacks, bitcoin]
    : [stacksTestnet, bitcoinTestnet];

// 3. Metadata for the app
const metadata = {
    name: 'Stacks Holiday Gifts',
    description: 'Send STX gifts to friends and family for the holidays! 🎁',
    url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// 4. Create AppKit with BitcoinAdapter
createAppKit({
    adapters: [bitcoinAdapter],
    networks: networks as any,
    projectId,
    metadata,
    features: {
        analytics: true,
        email: true, // Allow email login for new users
        socials: ['google', 'x', 'github'],
        swaps: true, // Native swaps within the modal
        onramp: true, // Native "Buy Crypto" flow
    },
    themeMode: 'dark',
    themeVariables: {
        '--w3m-accent': '#F48024', // Stacks orange
    },
});

// Query client for React Query
const queryClient = new QueryClient();

export function AppKitProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
