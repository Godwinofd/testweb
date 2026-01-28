import { NextResponse } from 'next/server';

export async function GET() {
    const checks = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        checks: {
            ghlApiKey: !!process.env.GHL_API_KEY,
            ghlLocationId: !!process.env.GHL_LOCATION_ID,
            requestSigningSecret: !!process.env.REQUEST_SIGNING_SECRET
        }
    };

    // If any critical env var is missing, return unhealthy
    const isHealthy = checks.checks.ghlApiKey &&
        checks.checks.ghlLocationId &&
        checks.checks.requestSigningSecret;

    return NextResponse.json(checks, {
        status: isHealthy ? 200 : 503
    });
}
