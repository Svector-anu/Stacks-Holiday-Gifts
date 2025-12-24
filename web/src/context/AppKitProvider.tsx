'use client';

import { createAppKit } from '@reown/appkit/react';
import { type AppKitNetwork } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Project ID from WalletConnect dashboard
const projectId = 'efd6780756aafd33f978f50f927e4a34';

// Stacks network configurations
const stacksTestnet = {
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

const stacksMainnet = {
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

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [stacksTestnet, stacksMainnet];

// Metadata for the app
const metadata = {
    name: 'Stacks Holiday Gifts',
    description: 'Send STX gifts to friends and family for the holidays!',
    url: 'https://stacks-holiday-gifts.vercel.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create AppKit at module level - BEFORE any hooks are used
createAppKit({
    projectId,
    metadata,
    networks,
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

// Query client for React Query
const queryClient = new QueryClient();

export function AppKitProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
