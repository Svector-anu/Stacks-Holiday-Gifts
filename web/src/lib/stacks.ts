import {
    openContractCall
} from '@stacks/connect';
import {
    uintCV,
    stringUtf8CV,
    bufferCV,
    PostConditionMode,
    Pc,
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
async function sha256Hash(data: Uint8Array): Promise<Uint8Array> {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
        // Create a copy of the buffer that TypeScript is happy with
        const buffer = new ArrayBuffer(data.length);
        const view = new Uint8Array(buffer);
        view.set(data);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
        return new Uint8Array(hashBuffer);
    }
    // Fallback - just return the padded data (for SSR)
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

// Create a gift
export async function createGift(
    senderAddress: string,
    amountStx: number,
    message: string,
    secret: string,
    onFinish: (txId: string) => void,
    onCancel: () => void
) {
    const amountMicroStx = stxToMicroStx(amountStx);

    // Hash the secret
    const encoder = new TextEncoder();
    const secretData = encoder.encode(secret);
    const paddedData = new Uint8Array(32);
    paddedData.set(secretData.slice(0, 32));
    const secretHash = await sha256Hash(paddedData);

    // Post condition using Pc helper
    const postCondition = Pc.principal(senderAddress).willSendLte(amountMicroStx).ustx();

    await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-gift',
        functionArgs: [
            uintCV(amountMicroStx),
            stringUtf8CV(message),
            bufferCV(secretHash),
        ],
        postConditionMode: PostConditionMode.Deny,
        postConditions: [postCondition],
        onFinish: (data) => {
            onFinish(data.txId);
        },
        onCancel: () => {
            onCancel();
        },
    });
}

// Claim a gift
export async function claimGift(
    giftId: number,
    secret: string,
    onFinish: (txId: string) => void,
    onCancel: () => void
) {
    const encoder = new TextEncoder();
    const secretData = encoder.encode(secret);
    const paddedSecret = new Uint8Array(32);
    paddedSecret.set(secretData.slice(0, 32));

    await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'claim-gift',
        functionArgs: [
            uintCV(giftId),
            bufferCV(paddedSecret),
        ],
        postConditionMode: PostConditionMode.Allow,
        postConditions: [],
        onFinish: (data) => {
            onFinish(data.txId);
        },
        onCancel: () => {
            onCancel();
        },
    });
}

// Generate gift link
export function generateGiftLink(giftId: number, secret: string): string {
    const baseUrl = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/gift/${giftId}?s=${encodeURIComponent(secret)}`;
}
