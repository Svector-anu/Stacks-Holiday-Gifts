'use client';

import { createAppKit } from '@reown/appkit/react';
import { mainnet } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Project ID from WalletConnect dashboard
const projectId = 'efd6780756aafd33f978f50f927e4a34';

// Use mainnet as the primary network (AppKit requires EVM-compatible network)
const networks = [mainnet] as const;

// Metadata for the app
const metadata = {
    name: 'Stacks Holiday Gifts',
    description: 'Send STX gifts to friends and family for the holidays!',
    url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
});

// Create AppKit at module level
createAppKit({
    adapters: [wagmiAdapter],
    networks,
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

// Query client for React Query
const queryClient = new QueryClient();

export function AppKitProvider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
