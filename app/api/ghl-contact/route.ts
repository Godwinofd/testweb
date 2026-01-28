import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { nanoid } from 'nanoid';
import logger from '@/lib/logger';
import rateLimiter from '@/lib/rateLimiter';
import { verifyRequest } from '@/lib/requestSigner';
import { detectBot, checkHoneypot, checkSubmissionTiming } from '@/lib/botDetection';
import ghlService from '@/lib/ghlService';

// Validation schema
const contactSchema = z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email().max(100),
    phone: z.string().min(8).max(20),
    postcode: z.string().min(3).max(10),
    occupancyStatus: z.string().optional(),
    heatingType: z.string().optional(),
    professionalSituation: z.string().optional(),
    projectType: z.string().optional(),
    surfaceArea: z.string().optional(),
    houseAge: z.string().optional(),
    timeline: z.string().optional(),
    // Security fields
    website_url: z.string().optional(), // Honeypot
    timestamp: z.number(), // For HMAC integrity (now)
    startTime: z.number(), // For bot timing (mount time)
    signature: z.string()
});

export async function POST(request: NextRequest) {
    const correlationId = nanoid();
    const startTime = Date.now();

    try {
        // Get client IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        logger.info({ correlationId, ip }, 'Received form submission');

        // Check request size (10KB max)
        const contentLength = request.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > 10240) {
            logger.warn({ correlationId, contentLength }, 'Request too large');
            return NextResponse.json(
                { error: 'Request too large' },
                { status: 413 }
            );
        }

        // Parse body
        let body;
        try {
            body = await request.json();
        } catch (error) {
            logger.warn({ correlationId }, 'Invalid JSON');
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            );
        }

        // Validate schema
        const validationResult = contactSchema.safeParse(body);
        if (!validationResult.success) {
            logger.warn({ correlationId, errors: validationResult.error.issues }, 'Validation failed');
            return NextResponse.json(
                { error: 'Invalid form data' },
                { status: 400 }
            );
        }

        const data = validationResult.data;

        // Bot Detection Layer 1: Honeypot
        if (checkHoneypot(data.website_url)) {
            logger.warn({ correlationId }, 'Bot detected: honeypot filled');
            return NextResponse.json(
                { error: 'Invalid submission' },
                { status: 400 }
            );
        }

        // Bot Detection Layer 2: Timing
        if (!checkSubmissionTiming(data.startTime)) {
            logger.warn({ correlationId, startTime: data.startTime }, 'Bot detected: invalid timing');
            return NextResponse.json(
                { error: 'Invalid submission' },
                { status: 400 }
            );
        }

        // Bot Detection Layer 3: User-Agent
        const userAgent = request.headers.get('user-agent');
        if (detectBot(userAgent)) {
            logger.warn({ correlationId, userAgent }, 'Bot detected: user-agent');
            return NextResponse.json(
                { error: 'Invalid submission' },
                { status: 400 }
            );
        }

        // Bot Detection Layer 4: HMAC Signature
        // Exclude website_url (honeypot) from the signed payload
        const { signature, timestamp, website_url, ...formDataWithStartTime } = data;
        const verificationResult = verifyRequest(formDataWithStartTime, signature, timestamp);
        if (!verificationResult.valid) {
            logger.warn({
                correlationId,
                error: verificationResult.error,
                receivedSignature: signature,
                receivedTimestamp: timestamp,
                formDataKeys: Object.keys(formDataWithStartTime)
            }, 'Invalid signature');
            return NextResponse.json(
                { error: 'Invalid request signature' },
                { status: 401 }
            );
        }

        // Sanitize inputs
        const sanitizedData = {
            firstName: DOMPurify.sanitize(data.firstName.trim()),
            lastName: DOMPurify.sanitize(data.lastName.trim()),
            email: data.email.toLowerCase().trim(),
            phone: data.phone.replace(/\D/g, ''), // Remove non-digits
            postcode: DOMPurify.sanitize(data.postcode.trim()),
            quizData: {
                occupancyStatus: data.occupancyStatus || '',
                heatingType: data.heatingType || '',
                professionalSituation: data.professionalSituation || '',
                projectType: data.projectType || '',
                surfaceArea: data.surfaceArea || '',
                houseAge: data.houseAge || '',
                timeline: data.timeline || ''
            }
        };

        // Rate Limiting Layer 1: IP-based
        const ipLimit = rateLimiter.checkIPLimit(ip);
        if (!ipLimit.allowed) {
            logger.warn({ correlationId, ip, retryAfter: ipLimit.retryAfter }, 'Rate limit exceeded: IP');
            return NextResponse.json(
                { error: 'Too many requests' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': ipLimit.retryAfter?.toString() || '900'
                    }
                }
            );
        }

        // Rate Limiting Layer 2: Email-based
        const emailLimit = rateLimiter.checkEmailLimit(sanitizedData.email);
        if (!emailLimit.allowed) {
            logger.warn({ correlationId, email: sanitizedData.email, retryAfter: emailLimit.retryAfter }, 'Rate limit exceeded: Email');
            return NextResponse.json(
                { error: 'Too many requests' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': emailLimit.retryAfter?.toString() || '3600'
                    }
                }
            );
        }

        // Check if contact already exists
        logger.info({ correlationId }, 'Checking if contact exists');
        const existingContact = await ghlService.contactExists(
            sanitizedData.email,
            sanitizedData.phone,
            correlationId
        );

        if (existingContact) {
            logger.info({ correlationId, contactId: existingContact.id }, 'Contact already exists, skipping creation');

            // Return success but don't create duplicate
            const duration = Date.now() - startTime;
            logger.info({ correlationId, duration }, 'Request completed (existing contact)');

            return NextResponse.json({
                success: true,
                message: 'Thank you for your submission'
            });
        }

        // Create new contact with website_lead tag
        logger.info({ correlationId }, 'Creating new contact');
        const newContact = await ghlService.createContact(sanitizedData, correlationId);

        const duration = Date.now() - startTime;
        logger.info({
            correlationId,
            contactId: newContact.id,
            duration
        }, 'Contact created successfully');

        return NextResponse.json({
            success: true,
            message: 'Thank you for your submission'
        });

    } catch (error: any) {
        const duration = Date.now() - startTime;
        logger.error({
            correlationId,
            error: error.message,
            duration
        }, 'Error processing form submission');

        return NextResponse.json(
            { error: 'An error occurred processing your submission' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS(request: NextRequest) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    const origin = request.headers.get('origin') || '';
    const host = request.headers.get('host') || '';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const currentHost = `${protocol}://${host}`;

    // Optimization: Allow same-origin or explicit allowed origins
    const isAllowed =
        !origin || // Same-origin or server-to-server
        origin === currentHost ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        (origin.endsWith('.vercel.app') && process.env.NODE_ENV !== 'production') || // Trusted Vercel previews
        process.env.NODE_ENV === 'development';

    if (!isAllowed) {
        logger.warn({ origin, currentHost }, 'CORS blocked');
        return new NextResponse(null, { status: 403 });
    }

    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}
