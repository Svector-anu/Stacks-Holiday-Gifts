'use client';

import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { ReactNode } from 'react';

// Use a custom Stacks-compatible chain config
// Since Stacks isn't directly in AppKit, we'll use it with WalletConnect's Stacks methods
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'efd6780756aafd33f978f50f927e4a34';

// Metadata for the app
const metadata = {
    name: 'Stacks Holiday Gifts',
    description: 'Send STX gifts to friends and family for the holidays!',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://stacks-holiday-gifts.vercel.app',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// For now, we'll use a minimal chain setup since Stacks uses WalletConnect RPC directly
// We'll create a custom network definition
const stacksTestnet = {
    id: 2147483648, // Stacks testnet chain ID for WalletConnect
    name: 'Stacks Testnet',
    nativeCurrency: {
        decimals: 6,
        name: 'STX',
        symbol: 'STX',
    },
    rpcUrls: {
        default: { http: ['https://api.testnet.hiro.so'] },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.stacks.co/?chain=testnet' },
    },
} as const;

const stacksMainnet = {
    id: 2147483649, // Stacks mainnet chain ID for WalletConnect
    name: 'Stacks Mainnet',
    nativeCurrency: {
        decimals: 6,
        name: 'STX',
        symbol: 'STX',
    },
    rpcUrls: {
        default: { http: ['https://api.hiro.so'] },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.stacks.co' },
    },
} as const;

const networks = process.env.NEXT_PUBLIC_NETWORK === 'mainnet'
    ? [stacksMainnet]
    : [stacksTestnet];

// Query client for React Query
const queryClient = new QueryClient();

// Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
    networks: networks as any,
    projectId,
    ssr: true,
});

// Create AppKit instance
createAppKit({
    adapters: [wagmiAdapter],
    networks: networks as any,
    projectId,
    metadata,
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

export function AppKitProvider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
