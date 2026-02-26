/**
 * This configuration file helps manage environment-specific variables.
 * It's designed to provide clear fallbacks and error messages
 * to ensure the application connects to the correct API endpoint.
 */

const getApiBase = (): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
        return apiUrl;
    }

    // For environments other than production, we can fall back to a default.
    if (process.env.NODE_ENV !== 'production') {
        console.warn(
            'Warning: NEXT_PUBLIC_API_URL environment variable is not set. ' +
            'Falling back to "http://localhost:4045/api/v1". ' +
            'Create a .env.local file to override this.'
        );
        return 'http://localhost:4045/api/v1';
    }

    // In production, we must have the API URL set.
    console.error('FATAL: NEXT_PUBLIC_API_URL is not set in the production environment.');
    throw new Error('Application is not configured correctly. Missing API URL.');
};

export const API_BASE = getApiBase();