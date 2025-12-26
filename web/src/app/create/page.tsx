'use client';

import dynamic from 'next/dynamic';
import ConnectWallet from "@/components/ConnectWallet";
import Link from "next/link";

// Force dynamic rendering
export const forceDynamic = 'force-dynamic';

// Dynamically import CreateGiftForm with SSR disabled
const CreateGiftForm = dynamic(
    () => import('@/components/CreateGiftForm'),
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

export default function CreatePage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🎁</span>
                        <span className="font-bold text-xl bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                            Stacks Gifts
                        </span>
                    </Link>
                    <ConnectWallet />
                </div>
            </header>

            {/* Main */}
            <main className="pt-24 pb-16 px-4">
                <div className="max-w-xl mx-auto">
                    <Link href="/" className="text-orange-400 hover:text-orange-300 mb-6 inline-block">
                        ← Back
                    </Link>

                    <div className="glass rounded-3xl p-8">
                        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span>✨</span>
                            Create a Gift Pack
                        </h1>
                        <CreateGiftForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
