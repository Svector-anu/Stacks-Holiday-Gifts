import {
    uintCV,
    stringUtf8CV,
    bufferCV,
} from '@stacks/transactions';

// Contract configuration - DEPLOYED TO TESTNET
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST3J1V2ZNMJRPYMYPJ8Q2NYHD8XW2V5KCMJ5GN9Z2';
export const CONTRACT_NAME = 'gift-escrow';

// Network
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

// Generate a random secret
export function generateSecret(): string {
    const array = new Uint8Array(16);
    if (typeof window !== 'undefined') {
        crypto.getRandomValues(array);
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Simple hash function for the secret (browser compatible)
export async function sha256Hash(data: Uint8Array): Promise<Uint8Array> {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
        const buffer = new ArrayBuffer(data.length);
        const view = new Uint8Array(buffer);
        view.set(data);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
        return new Uint8Array(hashBuffer);
    }
    return data;
}

// Convert STX to microSTX
export function stxToMicroStx(stx: number): bigint {
    return BigInt(Math.floor(stx * 1_000_000));
}

// Convert microSTX to STX
export function microStxToStx(microStx: bigint | number): number {
    return Number(microStx) / 1_000_000;
}

// Generate gift link
export function generateGiftLink(giftId: number, secret: string): string {
    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/gift/${giftId}?s=${encodeURIComponent(secret)}`;
}
