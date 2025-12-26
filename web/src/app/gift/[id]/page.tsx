'use client';

import { use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import ConnectWallet from '@/components/ConnectWallet';
import Link from 'next/link';

// Force dynamic rendering
export const forceDynamic = 'force-dynamic';

// Dynamically import ClaimGift with SSR disabled
const ClaimGift = dynamic(
    () => import('@/components/ClaimGift'),
    {
        ssr: false,
        loading: () => (
            <div className="text-center py-8">
                <div className="animate-pulse text-4xl mb-4">🎁</div>
                <p className="text-gray-400">Loading...</p>
            </div>
        )
    }
);

interface PageProps {
    params: Promise<{ id: string }>;
}

function GiftContent({ params }: PageProps) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const secret = searchParams.get('s') || '';
    const giftId = parseInt(id, 10);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🎁</span>
                        <span className="font-bold text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                            Stacks Holiday Gifts
                        </span>
                    </Link>
                    <ConnectWallet />
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-lg mx-auto">
                    {isNaN(giftId) ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">❌</div>
                            <h1 className="text-2xl font-bold text-white mb-4">Invalid Gift Link</h1>
                            <p className="text-gray-400 mb-6">This gift link appears to be invalid.</p>
                            <Link
                                href="/"
                                className="text-orange-400 hover:text-orange-300"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    ) : (
                        <ClaimGift
                            giftId={giftId}
                            secret={secret}
                            message="Happy Holidays! 🎄"
                        />
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="glass py-6 mt-auto">
                <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>🎄 Happy Holidays from Stacks Holiday Gifts! 🎄</p>
                </div>
            </footer>
        </div>
    );
}

export default function GiftPage({ params }: PageProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-pulse">🎁</div>
                    <p className="text-gray-400">Loading gift...</p>
                </div>
            </div>
        }>
            <GiftContent params={params} />
        </Suspense>
    );
}
