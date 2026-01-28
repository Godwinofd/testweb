import axios, { AxiosInstance } from 'axios';
import { parsePhoneNumber, CountryCode } from 'libphonenumber-js';
import logger from './logger';

const GHL_API_BASE_URL = process.env.GHL_API_BASE_URL || 'https://services.leadconnectorhq.com';
const GHL_API_KEY = process.env.GHL_API_KEY || ''; // This will be the Private Integration Token
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_API_TIMEOUT = parseInt(process.env.GHL_API_TIMEOUT || '10000');
const GHL_MOCK_MODE = process.env.GHL_MOCK_MODE === 'true';

interface GHLContact {
    id: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    tags?: string[];
}

interface CreateContactData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    postcode: string;
    quizData: Record<string, string>;
}

class GoHighLevelService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: GHL_API_BASE_URL,
            timeout: GHL_API_TIMEOUT,
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28' // Required for API v2
            }
        });
    }

    private isMock(): boolean {
        return GHL_MOCK_MODE || !GHL_API_KEY || GHL_API_KEY === 'your_private_integration_token_here';
    }

    /**
     * Normalize phone number to E.164 format
     */
    normalizePhone(phone: string, defaultCountry: CountryCode = 'FR'): string {
        try {
            // Remove all non-digits first
            const cleaned = phone.replace(/\D/g, '');

            // Parse and format
            const phoneNumber = parsePhoneNumber(cleaned, defaultCountry);

            if (phoneNumber && phoneNumber.isValid()) {
                return phoneNumber.format('E.164');
            }

            // If parsing fails, return original cleaned number with + prefix
            return `+${cleaned}`;
        } catch (error) {
            logger.warn({ phone, error }, 'Phone normalization failed, using original');
            return phone;
        }
    }

    /**
     * Search for contact by email
     */
    async searchByEmail(email: string, correlationId: string): Promise<GHLContact | null> {
        if (this.isMock()) {
            logger.info({ correlationId, email }, '[MOCK] Searching contact by email (Simulating not found)');
            return null;
        }
        try {
            logger.info({ correlationId, email }, 'Searching contact by email');

            const response = await this.client.get('/contacts', {
                params: {
                    locationId: GHL_LOCATION_ID,
                    email: email.toLowerCase().trim()
                }
            });

            const contacts = response.data.contacts || [];

            if (contacts.length > 0) {
                logger.info({ correlationId, contactId: contacts[0].id }, 'Contact found by email');
                return contacts[0];
            }

            logger.info({ correlationId }, 'No contact found by email');
            return null;
        } catch (error: any) {
            logger.error({
                correlationId,
                error: error.message,
                responseData: error.response?.data,
                status: error.response?.status
            }, 'Error searching contact by email');
            throw new Error('Failed to search contact by email');
        }
    }

    /**
     * Search for contact by phone
     */
    async searchByPhone(phone: string, correlationId: string): Promise<GHLContact | null> {
        if (this.isMock()) {
            logger.info({ correlationId, phone }, '[MOCK] Searching contact by phone (Simulating not found)');
            return null;
        }
        try {
            const normalizedPhone = this.normalizePhone(phone);
            logger.info({ correlationId, phone: normalizedPhone }, 'Searching contact by phone');

            const response = await this.client.get('/contacts', {
                params: {
                    locationId: GHL_LOCATION_ID,
                    phone: normalizedPhone
                }
            });

            const contacts = response.data.contacts || [];

            if (contacts.length > 0) {
                logger.info({ correlationId, contactId: contacts[0].id }, 'Contact found by phone');
                return contacts[0];
            }

            logger.info({ correlationId }, 'No contact found by phone');
            return null;
        } catch (error: any) {
            logger.error({
                correlationId,
                error: error.message,
                responseData: error.response?.data,
                status: error.response?.status
            }, 'Error searching contact by phone');
            throw new Error('Failed to search contact by phone');
        }
    }

    /**
     * Create new contact with website_lead tag
     * CRITICAL: Tag must be included in creation payload for workflow trigger
     */
    async createContact(data: CreateContactData, correlationId: string): Promise<GHLContact> {
        if (this.isMock()) {
            logger.info({ correlationId, email: data.email }, '[MOCK] Creating new contact (Simulating success)');
            return {
                id: 'mock-contact-id-' + Date.now(),
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                tags: ['website_lead']
            };
        }
        try {
            const normalizedPhone = this.normalizePhone(data.phone);

            const payload = {
                locationId: GHL_LOCATION_ID,
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email: data.email.toLowerCase().trim(),
                phone: normalizedPhone,
                tags: ['website_lead'], // CRITICAL: Must be in creation payload
                customFields: [
                    { id: 'postcode', value: data.postcode }, // In v2, keys are often UUID IDs or specific keys
                    { id: 'occupancyStatus', value: data.quizData.occupancyStatus || '' },
                    { id: 'heatingType', value: data.quizData.heatingType || '' },
                    { id: 'professionalSituation', value: data.quizData.professionalSituation || '' },
                    { id: 'source', value: 'website_quiz' },
                    { id: 'submissionDate', value: new Date().toISOString() }
                ]
            };

            logger.info({ correlationId, email: payload.email }, 'Creating new contact with website_lead tag (API v2)');

            const response = await this.client.post('/contacts', payload);

            const contact = response.data.contact;
            logger.info({ correlationId, contactId: contact.id }, 'Contact created successfully');

            return contact;
        } catch (error: any) {
            logger.error({
                correlationId,
                error: error.message,
                response: error.response?.data
            }, 'Error creating contact');
            throw new Error('Failed to create contact in GoHighLevel');
        }
    }

    /**
     * Check if contact exists (email first, phone fallback)
     */
    async contactExists(email: string, phone: string, correlationId: string): Promise<GHLContact | null> {
        // Try email first
        const contactByEmail = await this.searchByEmail(email, correlationId);
        if (contactByEmail) return contactByEmail;

        // Fallback to phone
        const contactByPhone = await this.searchByPhone(phone, correlationId);
        return contactByPhone;
    }
}

// Singleton instance
const ghlService = new GoHighLevelService();

export default ghlService;
