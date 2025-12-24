import {
    uintCV,
    stringUtf8CV,
    bufferCV,
    serializeCV,
} from '@stacks/transactions';

// Contract configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
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

// Helper to serialize CV to hex
export function cvToHex(cv: ReturnType<typeof uintCV>): string {
    const serialized = serializeCV(cv);
    return Array.from(serialized, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Helper to prepare create-gift arguments
export async function prepareCreateGiftArgs(amountStx: number, message: string, secret: string) {
    const amountMicroStx = stxToMicroStx(amountStx);

    // Hash the secret
    const encoder = new TextEncoder();
    const secretData = encoder.encode(secret);
    const paddedData = new Uint8Array(32);
    paddedData.set(secretData.slice(0, 32));
    const secretHash = await sha256Hash(paddedData);

    return {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: 'create-gift',
        functionArgs: [
            cvToHex(uintCV(amountMicroStx)),
            cvToHex(stringUtf8CV(message)),
            cvToHex(bufferCV(secretHash)),
        ],
    };
}

// Helper to prepare claim-gift arguments
export function prepareClaimGiftArgs(giftId: number, secret: string) {
    const encoder = new TextEncoder();
    const secretData = encoder.encode(secret);
    const paddedSecret = new Uint8Array(32);
    paddedSecret.set(secretData.slice(0, 32));

    return {
        contract: `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`,
        functionName: 'claim-gift',
        functionArgs: [
            cvToHex(uintCV(giftId)),
            cvToHex(bufferCV(paddedSecret)),
        ],
    };
}

// Generate gift link
export function generateGiftLink(giftId: number, secret: string): string {
    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/gift/${giftId}?s=${encodeURIComponent(secret)}`;
}
