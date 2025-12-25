'use client';

import { createAppKit } from '@reown/appkit/react';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { bitcoin, bitcoinTestnet } from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Project ID from WalletConnect dashboard
const projectId = 'efd6780756aafd33f978f50f927e4a34';

// 1. Setup the Bitcoin Adapter (supports Stacks wallets like Leather & Xverse)
const bitcoinAdapter = new BitcoinAdapter();

// 2. Use only Bitcoin networks (AppKit doesn't fully support custom Stacks chains yet)
// Stacks wallets like Leather/Xverse will still connect via Bitcoin adapter
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [bitcoinTestnet, bitcoin];

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
    networks,
    projectId,
    metadata,
    features: {
        analytics: true,
        email: true,
        socials: ['google', 'x', 'github'],
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
