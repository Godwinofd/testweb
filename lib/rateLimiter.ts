import { nanoid } from 'nanoid';

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private ipLimits: Map<string, RateLimitEntry> = new Map();
    private emailLimits: Map<string, RateLimitEntry> = new Map();
    private maxEntries = 10000; // Prevent memory overflow

    private maxRequestsPerIP: number;
    private windowMinutesIP: number;
    private maxRequestsPerEmail: number;
    private windowHoursEmail: number;

    constructor() {
        this.maxRequestsPerIP = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_PER_IP || '5');
        this.windowMinutesIP = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15');
        this.maxRequestsPerEmail = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_PER_EMAIL || '10');
        this.windowHoursEmail = parseInt(process.env.RATE_LIMIT_EMAIL_WINDOW_HOURS || '1');

        // Cleanup expired entries every 5 minutes
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    private cleanup() {
        const now = Date.now();

        // Clean IP limits
        for (const [key, entry] of this.ipLimits.entries()) {
            if (entry.resetTime < now) {
                this.ipLimits.delete(key);
            }
        }

        // Clean email limits
        for (const [key, entry] of this.emailLimits.entries()) {
            if (entry.resetTime < now) {
                this.emailLimits.delete(key);
            }
        }

        // If still too many entries, remove oldest (LRU-style)
        if (this.ipLimits.size > this.maxEntries) {
            const toDelete = Array.from(this.ipLimits.keys()).slice(0, this.ipLimits.size - this.maxEntries);
            toDelete.forEach(key => this.ipLimits.delete(key));
        }

        if (this.emailLimits.size > this.maxEntries) {
            const toDelete = Array.from(this.emailLimits.keys()).slice(0, this.emailLimits.size - this.maxEntries);
            toDelete.forEach(key => this.emailLimits.delete(key));
        }
    }

    checkIPLimit(ip: string): { allowed: boolean; retryAfter?: number } {
        const now = Date.now();
        const entry = this.ipLimits.get(ip);

        if (!entry || entry.resetTime < now) {
            // New window
            this.ipLimits.set(ip, {
                count: 1,
                resetTime: now + this.windowMinutesIP * 60 * 1000
            });
            return { allowed: true };
        }

        if (entry.count >= this.maxRequestsPerIP) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
            return { allowed: false, retryAfter };
        }

        entry.count++;
        return { allowed: true };
    }

    checkEmailLimit(email: string): { allowed: boolean; retryAfter?: number } {
        const now = Date.now();
        const entry = this.emailLimits.get(email.toLowerCase());

        if (!entry || entry.resetTime < now) {
            // New window
            this.emailLimits.set(email.toLowerCase(), {
                count: 1,
                resetTime: now + this.windowHoursEmail * 60 * 60 * 1000
            });
            return { allowed: true };
        }

        if (entry.count >= this.maxRequestsPerEmail) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
            return { allowed: false, retryAfter };
        }

        entry.count++;
        return { allowed: true };
    }
}

// Singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter;
