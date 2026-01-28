import pino from 'pino';

const logger = pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    base: {
        env: process.env.NODE_ENV,
    },
    // Never log sensitive data
    redact: {
        paths: ['req.headers.authorization', '*.apiKey', '*.password', '*.token'],
        remove: true
    }
});

export default logger;
