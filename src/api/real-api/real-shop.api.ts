import { IBrand } from '~/interfaces/brand';
import { IFilterValues, IListOptions, IReviewsList } from '~/interfaces/list';
import { IOrder } from '~/interfaces/order';
import { IProduct, IProductsList } from '~/interfaces/product';
import { IReview } from '~/interfaces/review';
import { IShopCategory } from '~/interfaces/category';
import {
    IAddProductReviewData,
    ICheckoutData,
    IGetBrandsOptions,
    IGetCategoriesOptions,
    IGetCategoryBySlugOptions,
    IGetSearchSuggestionsOptions,
    IGetSearchSuggestionsResult,
    ShopApi,
} from '~/api/base';
import { apiRequest, publicApiRequest } from '~/api/http-client';

export class RealShopApi implements ShopApi {
    async getCategoryBySlug(slug: string, options?: IGetCategoryBySlugOptions): Promise<IShopCategory> {
        const params = new URLSearchParams();
        if (options?.depth) params.set('depth', String(options.depth));
        try {
            const res = await publicApiRequest(`/categories/slug/${slug}?${params.toString()}`);
            return mapCategory(res);
        } catch (error) {
            try {
                const res = await publicApiRequest(`/categories/${slug}?${params.toString()}`);
                return mapCategory(res);
            } catch (fallbackError) {
                console.warn(`Category not found: ${slug}`, { error, fallbackError });
                throw new Error(`Category not found: ${slug}`);
            }
        }
    }

    private async getCategoryIdBySlug(slug: string): Promise<string | null> {
        try {
            const category = await this.getCategoryBySlug(slug);
            return category?.id ? String(category.id) : null;
        } catch {
            return null;
        }
    }

    async getCategories(options?: IGetCategoriesOptions): Promise<IShopCategory[]> {
        const params = new URLSearchParams();
        if (options?.depth) params.set('depth', String(options.depth));
        if (options?.parent?.id) params.set('parentId', String(options.parent.id));
        if (options?.slugs?.length) params.set('slugs', options.slugs.join(','));

        const res = await publicApiRequest(`/categories?${params.toString()}`);
        const items = Array.isArray(res) ? res : (res.data || []);
        return items.map(mapCategory);
    }

    async getBrands(options?: IGetBrandsOptions): Promise<IBrand[]> {
        const params = new URLSearchParams();
        if (options?.limit) params.set('limit', String(options.limit));
        const res = await publicApiRequest(`/brands?${params.toString()}`);
        const items = Array.isArray(res) ? res : (res.data || []);
        return items.map(mapBrand);
    }

    async getProductsList(options: IListOptions = {}, filters: IFilterValues = {}): Promise<IProductsList> {
        const params = new URLSearchParams();
        if (options.page) params.set('page', String(options.page));
        if (options.limit) params.set('limit', String(options.limit));
        if (options.sort) params.set('sortBy', options.sort);

        if (filters.category) {
            const categoryId = await this.getCategoryIdBySlug(String(filters.category));
            if (categoryId) {
                params.set('categoryId', categoryId);
            }
        }

        // Whitelist of backend-accepted parameters
        const allowedParams = [
            'search', 'categoryId', 'brandId', 'shopId', 'carId',
            'vehicleType', 'condition', 'minPrice', 'maxPrice', 'isFeatured'
        ];

        // Map filters to query params
        Object.entries(filters).forEach(([key, value]) => {
            if (!value) return;

            if (key === 'vehicle') {
                // Handle vehicle compatibility filter
                params.set('carId', String(value));
            } else if (key === 'category') {
                // handled above
            } else if (allowedParams.includes(key)) {
                params.set(key, value);
            }
            // Ignore unknown parameters like 'brand', 'part_type'
        });

        const res = await publicApiRequest(`/products?${params.toString()}`);
        const products = (res.data || []).map(mapProduct);

        return {
            items: products,
            sort: options.sort || 'default',
            navigation: {
                type: 'page',
                page: res.meta?.page || 1,
                limit: res.meta?.limit || 20,
                total: res.meta?.total || 0,
                pages: res.meta?.totalPages || 1,
                from: ((res.meta?.page || 1) - 1) * (res.meta?.limit || 20) + 1,
                to: Math.min((res.meta?.page || 1) * (res.meta?.limit || 20), res.meta?.total || 0),
            },
            filters: buildFiltersFromResponse(res.filters),
        };
    }

    async getProductBySlug(slug: string): Promise<IProduct> {
        const endpoint = `/products/slug/${slug}`;
        console.log(`🔍 Fetching product from endpoint: ${endpoint}`);
        
        try {
            const res = await apiRequest(endpoint);
            console.log(`✅ Product fetched successfully:`, res);
            return mapProduct(res);
        } catch (error) {
            console.error(`❌ Failed to fetch product from ${endpoint}:`, error);
            
            // Try alternative endpoints
            const alternatives = [
                `/products/${slug}`,
                `/api/v1/products/slug/${slug}`,
                `/api/v1/products/${slug}`,
            ];
            
            for (const altEndpoint of alternatives) {
                try {
                    console.log(`🔄 Trying alternative endpoint: ${altEndpoint}`);
                    const res = await apiRequest(altEndpoint);
                    console.log(`✅ Alternative endpoint worked:`, altEndpoint);
                    return mapProduct(res);
                } catch (altError) {
                    console.log(`❌ Alternative ${altEndpoint} failed:`, altError);
                }
            }
            
            throw error;
        }
    }

    async getProductReviews(productId: number, options?: IListOptions): Promise<IReviewsList> {
        const params = new URLSearchParams();
        if (options?.page) params.set('page', String(options.page));
        if (options?.limit) params.set('limit', String(options.limit));

        const res = await apiRequest(`/reviews/product/${productId}?${params.toString()}`);
        const items = (res.data || res || []).map(mapReview);

        return {
            items,
            sort: options?.sort || 'default',
            navigation: {
                type: 'page',
                page: res.meta?.page || 1,
                limit: res.meta?.limit || 10,
                total: res.meta?.total || items.length,
                pages: res.meta?.totalPages || 1,
                from: 1,
                to: items.length,
            },
        };
    }

    async addProductReview(productId: number, data: IAddProductReviewData): Promise<IReview> {
        const res = await apiRequest(`/reviews`, {
            method: 'POST',
            body: JSON.stringify({
                productId,
                rating: data.rating,
                comment: data.content,
            }),
        });
        return mapReview(res);
    }

    async getProductAnalogs(productId: number): Promise<IProduct[]> {
        try {
            const res = await apiRequest(`/products/${productId}/related?limit=5`);
            return (Array.isArray(res) ? res : res.data || []).map(mapProduct);
        } catch {
            return [];
        }
    }

    async getRelatedProducts(productId: number, limit: number): Promise<IProduct[]> {
        try {
            const res = await apiRequest(`/products/${productId}/related?limit=${limit}`);
            return (Array.isArray(res) ? res : res.data || []).map(mapProduct);
        } catch {
            return [];
        }
    }

    async getFeaturedProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
        const params = new URLSearchParams({ limit: String(limit), isFeatured: 'true' });
        if (categorySlug) {
            const categoryId = await this.getCategoryIdBySlug(categorySlug);
            if (categoryId) params.set('categoryId', categoryId);
        }
        try {
            const res = await publicApiRequest(`/products?${params.toString()}`);
            return (res.data || []).map(mapProduct);
        } catch (error) {
            console.warn(`Failed to fetch featured products for category: ${categorySlug}`, error);
            return [];
        }
    }

    async getPopularProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
        const params = new URLSearchParams({ limit: String(limit), sortBy: 'rating' });
        if (categorySlug) {
            const categoryId = await this.getCategoryIdBySlug(categorySlug);
            if (categoryId) params.set('categoryId', categoryId);
        }
        try {
            const res = await publicApiRequest(`/products?${params.toString()}`);
            return (res.data || []).map(mapProduct);
        } catch (error) {
            console.warn(`Failed to fetch popular products for category: ${categorySlug}`, error);
            return [];
        }
    }

    async getTopRatedProducts(categorySlug: string | null, limit: number): Promise<IProduct[]> {
        const params = new URLSearchParams({ limit: String(limit), sortBy: 'rating' });
        if (categorySlug) {
            const categoryId = await this.getCategoryIdBySlug(categorySlug);
            if (categoryId) params.set('categoryId', categoryId);
        }
        try {
            const res = await publicApiRequest(`/products?${params.toString()}`);
            return (res.data || []).map(mapProduct);
        } catch (error) {
            console.warn(`Failed to fetch top rated products for category: ${categorySlug}`, error);
            return [];
        }
    }

    async getSpecialOffers(limit: number): Promise<IProduct[]> {
        // Get products with comparePrice higher than price (indicating they're on sale)
        const res = await publicApiRequest(`/products?limit=${limit}&sortBy=popular`);
        const products = (res.data || []).map(mapProduct);
        // Filter to only show products actually on sale
        return products.filter((p: IProduct) => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    async getLatestProducts(limit: number): Promise<IProduct[]> {
        const res = await publicApiRequest(`/products?limit=${limit}&sortBy=newest`);
        return (res.data || []).map(mapProduct);
    }

    async getSearchSuggestions(
        query: string,
        options?: IGetSearchSuggestionsOptions,
    ): Promise<IGetSearchSuggestionsResult> {
        const params = new URLSearchParams({ q: query });
        if (options?.limitProducts) params.set('limitProducts', String(options.limitProducts));
        if (options?.limitCategories) params.set('limitCategories', String(options.limitCategories));

        const res = await publicApiRequest(`/search/suggestions?${params.toString()}`);
        return {
            products: (res.products || []).map(mapProduct),
            categories: (res.categories || []).map(mapCategory),
            brands: (res.brands || []).map(mapBrand),
        };
    }

    async getSearchResults(
        query: string,
        options?: {
            page?: number;
            limit?: number;
            category?: string;
            sort?: string;
        }
    ): Promise<{
        products: IProduct[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const page = options?.page ?? 1;
        const limit = options?.limit ?? 20;
        // Use dedicated search endpoint (returns { data, meta }) or products list with search param
        const searchParams = new URLSearchParams({ q: query, page: String(page), limit: String(limit) });
        if (options?.category) searchParams.set('categoryId', options.category);
        if (options?.sort) searchParams.set('sortBy', options.sort);

        let res: any;
        try {
            res = await publicApiRequest(`/search/products?${searchParams.toString()}`);
        } catch {
            // Fallback: products list with search param (same shape: { data, meta })
            const fallbackParams = new URLSearchParams({ search: query, page: String(page), limit: String(limit) });
            if (options?.category) fallbackParams.set('categoryId', options.category);
            if (options?.sort) fallbackParams.set('sortBy', options.sort);
            res = await publicApiRequest(`/products?${fallbackParams.toString()}`);
        }

        // Accept { data, meta } (paginated) or { products, total, page, totalPages } or raw array
        const rawList = Array.isArray(res)
            ? res
            : (res.data ?? res.products ?? []);
        const products = rawList.map(mapProduct);
        const total = res.meta?.total ?? res.total ?? products.length;
        const totalPages = res.meta?.totalPages ?? res.totalPages ?? Math.max(1, Math.ceil(total / limit));

        return {
            products,
            total,
            page: res.meta?.page ?? res.page ?? page,
            totalPages,
        };
    }

    async checkout(data: ICheckoutData): Promise<IOrder> {
        const res = await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify({
                items: data.items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    options: item.options,
                })),
                shippingAddress: data.shippingAddress,
                billingAddress: data.billingAddress,
                paymentMethod: data.payment,
                comment: data.comment,
            }),
        });
        return mapOrder(res);
    }
}

// ── Mappers ──────────────────────────────────────────────

function mapCategory(c: any): IShopCategory {
    return {
        id: c.id,
        type: 'shop',
        name: c.name || '',
        slug: c.slug || '',
        image: c.image || null,
        items: c._count?.products || c.productCount || 0,
        parent: c.parent ? mapCategory(c.parent) : null,
        children: c.children ? c.children.map(mapCategory) : undefined,
        layout: c.children?.length > 0 ? 'categories' : 'products',
        customFields: {},
    };
}

function mapShop(s: any): IShop {
    const lat = s.latitude ?? s.lat;
    const lng = s.longitude ?? s.lng;
    return {
        id: s.id,
        slug: s.slug || '',
        name: s.name || '',
        image: s.logo || s.image || '',
        country: s.country || '',
        latitude: lat != null ? Number(lat) : undefined,
        longitude: lng != null ? Number(lng) : undefined,
        city: s.city || '',
        address: s.address || '',
        phone: s.phone || '',
        email: s.email || '',
        whatsapp: s.whatsapp || '',
        rating: s.rating ? Number(s.rating) : undefined,
        reviewCount: s.reviewCount || s._count?.reviews || 0,
    };
}

function mapBrand(b: any): IBrand {
    return {
        id: b.id,
        slug: b.slug || '',
        name: b.name || '',
        image: b.logo || b.image || '',
        country: b.country || '',
        latitude: b.latitude ? Number(b.latitude) : undefined,
        longitude: b.longitude ? Number(b.longitude) : undefined,
        shopId: b.shopId ? Number(b.shopId) : undefined,
    };
}

function mapProduct(p: any): IProduct {
    const images = (p.images || []).map((img: any) =>
        typeof img === 'string' ? img : img.url || ''
    );

    let stockStatus: 'in-stock' | 'out-of-stock' | 'on-backorder' = 'in-stock';
    if (p.stock === 0 || p.stock === 'out-of-stock') stockStatus = 'out-of-stock';
    if (p.stock === 'on-backorder') stockStatus = 'on-backorder';

    // Handle car compatibility
    let compatibility: 'all' | 'unknown' | number[] = 'all';
    if (p.compatibleCars && Array.isArray(p.compatibleCars)) {
        compatibility = p.compatibleCars.map((comp: any) => comp.carId || comp.car?.id).filter(Boolean);
    } else if (p.compatibleCars && p.compatibleCars.length === 0) {
        compatibility = 'unknown';
    }

    return {
        id: p.id,
        name: p.name || '',
        excerpt: p.excerpt || p.description?.slice(0, 200) || '',
        description: p.description || '',
        slug: p.slug || '',
        sku: p.sku || '',
        partNumber: p.partNumber || p.sku || '',
        stock: stockStatus,
        price: Number(p.price) || 0,
        compareAtPrice: p.comparePrice ? Number(p.comparePrice) : null,
        images,
        badges: p.badges || buildBadges(p),
        rating: p.rating ? Number(p.rating) : null,
        reviews: p.reviewCount || p._count?.reviews || 0,
        availability: p.availability || (stockStatus === 'in-stock' ? 'In Stock' : 'Out of Stock'),
        compatibility,
        brand: p.brand ? mapBrand(p.brand) : null,
        shop: p.shop ? mapShop(p.shop) : null,
        tags: p.tags || [],
        type: {
            name: p.vehicleType === 'MOTO' ? 'Moto Parts' : 'Auto Parts',
            slug: p.vehicleType === 'MOTO' ? 'moto-parts' : 'auto-parts',
            attributeGroups: [],
        },
        categories: p.categories ? p.categories.map(mapCategory) : (p.category ? [mapCategory(p.category)] : []),
        attributes: (p.specifications || p.attributes || []).map((attr: any) => ({
            name: attr.key || attr.name || '',
            slug: (attr.key || attr.name || '').toLowerCase().replace(/\s+/g, '-'),
            featured: attr.featured || false,
            values: [{
                name: attr.value || '',
                slug: (attr.value || '').toLowerCase().replace(/\s+/g, '-'),
            }],
        })),
        options: [],
    };
}

function buildBadges(p: any): string[] {
    const badges: string[] = [];
    if (p.comparePrice && Number(p.comparePrice) > Number(p.price)) badges.push('sale');
    if (p.isNew) badges.push('new');
    if (p.condition === 'imported') badges.push('hot');
    if (p.isFeatured) badges.push('featured');
    return badges;
}

function mapReview(r: any): IReview {
    return {
        id: r.id,
        date: r.createdAt || '',
        author: r.user?.firstName ? `${r.user.firstName} ${r.user.lastName || ''}`.trim() : (r.author || 'Anonymous'),
        avatar: r.user?.avatar || r.avatar || '',
        rating: r.rating || 0,
        content: r.comment || r.content || '',
    };
}

function mapOrder(o: any): IOrder {
    return {
        id: o.id,
        token: o.orderNumber || o.id,
        number: o.orderNumber || '',
        createdAt: o.createdAt || '',
        payment: o.payment?.method || 'unknown',
        status: o.status?.toLowerCase() || 'pending',
        items: (o.items || []).map((item: any) => ({
            product: mapProduct(item.product || {}),
            options: [],
            price: Number(item.price),
            quantity: item.quantity,
            total: Number(item.total),
        })),
        quantity: (o.items || []).reduce((sum: number, i: any) => sum + i.quantity, 0),
        subtotal: Number(o.subtotal || o.total),
        totals: [],
        total: Number(o.total),
        shippingAddress: o.address ? mapAddressData(o.address) : emptyAddress(),
        billingAddress: o.address ? mapAddressData(o.address) : emptyAddress(),
    };
}

function mapAddressData(a: any) {
    return {
        firstName: a.firstName || '', lastName: a.lastName || '', company: a.company || '',
        country: a.country || '', address1: a.address1 || a.street || '', address2: a.address2 || '',
        city: a.city || '', state: a.state || '', postcode: a.postcode || '', email: a.email || '', phone: a.phone || '',
    };
}

function emptyAddress() {
    return { firstName: '', lastName: '', company: '', country: '', address1: '', address2: '', city: '', state: '', postcode: '', email: '', phone: '' };
}

function buildFiltersFromResponse(filters?: any[]): any[] {
    if (!filters || !Array.isArray(filters)) return [];
    return filters;
}
