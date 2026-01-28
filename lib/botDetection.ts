export function detectBot(userAgent: string | null): boolean {
    if (!userAgent) return true; // No user agent = likely bot

    const botPatterns = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /curl/i,
        /wget/i,
        /python/i,
        /java/i,
        /http/i,
        /postman/i
    ];

    return botPatterns.some(pattern => pattern.test(userAgent));
}

export function checkHoneypot(honeypotValue: string | undefined): boolean {
    // If honeypot field is filled, it's a bot
    return !!honeypotValue && honeypotValue.trim().length > 0;
}

export function checkSubmissionTiming(timestamp: number): boolean {
    const now = Date.now();
    const minTime = 2000; // 2 seconds minimum
    const elapsed = now - timestamp;

    // Too fast = bot
    if (elapsed < minTime) return false;

    // Too old (more than 1 hour) = suspicious
    if (elapsed > 60 * 60 * 1000) return false;

    return true;
}

export function generateFingerprint(data: {
    userAgent?: string;
    acceptLanguage?: string;
    acceptEncoding?: string;
}): string {
    const parts = [
        data.userAgent || '',
        data.acceptLanguage || '',
        data.acceptEncoding || ''
    ];

    return Buffer.from(parts.join('|')).toString('base64');
}
