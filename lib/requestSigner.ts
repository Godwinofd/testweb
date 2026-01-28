import crypto from 'crypto';

export function generateSignature(payload: string, secret: string): string {
    return crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
}

export function verifySignature(
    payload: string,
    signature: string,
    secret: string
): boolean {
    const expectedSignature = generateSignature(payload, secret);
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

export function signRequest(data: any): { signature: string; timestamp: number } {
    const timestamp = Date.now();
    const payload = JSON.stringify({ ...data, timestamp });
    const secret = process.env.REQUEST_SIGNING_SECRET || '';

    return {
        signature: generateSignature(payload, secret),
        timestamp
    };
}

export function verifyRequest(
    data: any,
    signature: string,
    timestamp: number
): { valid: boolean; error?: string } {
    const secret = process.env.REQUEST_SIGNING_SECRET || '';

    // Check timestamp (reject if older than 5 minutes)
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    if (now - timestamp > maxAge) {
        return { valid: false, error: 'Request expired' };
    }

    if (timestamp > now + 60000) { // Allow 1 minute clock skew
        return { valid: false, error: 'Request timestamp in future' };
    }

    const payload = JSON.stringify({ ...data, timestamp });

    try {
        const isValid = verifySignature(payload, signature, secret);
        return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
    } catch (error) {
        return { valid: false, error: 'Signature verification failed' };
    }
}
