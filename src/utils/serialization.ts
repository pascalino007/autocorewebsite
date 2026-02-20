/**
 * Utility functions to handle JSON serialization for Next.js server-side props
 * Next.js cannot serialize undefined, functions, Symbols, or circular references
 */

export function sanitizeForSerialization<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
            return obj.map(sanitizeForSerialization) as T;
        }

        const sanitized: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                
                // Convert undefined to null for JSON serialization
                if (value === undefined) {
                    sanitized[key] = null;
                } else if (typeof value === 'function') {
                    // Skip functions
                    continue;
                } else if (typeof value === 'object' && value !== null) {
                    // Recursively sanitize nested objects
                    sanitized[key] = sanitizeForSerialization(value);
                } else {
                    sanitized[key] = value;
                }
            }
        }
        return sanitized;
    }

    return obj;
}

/**
 * Sanitize brand data to handle undefined optional fields
 */
export function sanitizeBrand(brand: any): any {
    if (!brand) return null;

    return {
        ...brand,
        latitude: brand.latitude ?? null,
        longitude: brand.longitude ?? null,
    };
}

/**
 * Sanitize shop/supplier data so undefined latitude/longitude are null (safe for JSON)
 */
export function sanitizeShop(shop: any): any {
    if (!shop) return null;

    return {
        ...shop,
        latitude: shop.latitude ?? null,
        longitude: shop.longitude ?? null,
        city: shop.city ?? null,
        country: shop.country ?? null,
    };
}

/**
 * Sanitize category data to handle undefined nested properties
 */
export function sanitizeCategory(category: any): any {
    if (!category) return null;
    
    return {
        ...category,
        parent: category.parent || null,
        children: category.children || null,
        items: category.items || 0,
        customFields: category.customFields || {},
    };
}

/**
 * Sanitize array of categories
 */
export function sanitizeCategories(categories: any[] = []): any[] {
    return categories.map(cat => sanitizeCategory(cat));
}

/**
 * Sanitize product data specifically for getServerSideProps
 */
export function sanitizeProductForSSP(product: any) {
    return {
        ...product,
        rating: product.rating ?? null,
        compareAtPrice: product.compareAtPrice ?? null,
        brand: sanitizeBrand(product.brand),
        shop: sanitizeShop(product.shop),
        categories: sanitizeCategories(product.categories),
        tags: product.tags ?? [],
        badges: product.badges ?? [],
        images: product.images ?? [],
        reviews: product.reviews ?? 0,
        availability: product.availability ?? null,
    };
}

/**
 * Safe JSON.stringify with error handling
 */
export function safeStringify(obj: any, indent?: number): string {
    try {
        return JSON.stringify(obj, (key, value) => {
            // Convert undefined to null
            if (value === undefined) {
                return null;
            }
            // Skip functions
            if (typeof value === 'function') {
                return undefined;
            }
            return value;
        }, indent);
    } catch (error) {
        console.error('Serialization error:', error);
        return JSON.stringify({ error: 'Serialization failed' });
    }
}
