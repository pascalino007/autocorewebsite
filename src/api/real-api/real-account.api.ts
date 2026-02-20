import { IAddress } from '~/interfaces/address';
import { IListOptions, IOrdersList } from '~/interfaces/list';
import { IOrder } from '~/interfaces/order';
import { IUser } from '~/interfaces/user';
import {
    AccountApi,
    IEditAddressData,
    IEditProfileData,
} from '~/api/base';
import { apiRequest, setTokens, clearTokens } from '~/api/http-client';

export class RealAccountApi extends AccountApi {
    async signIn(email: string, password: string): Promise<IUser> {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return mapUser(data.user);
    }

    async signUp(email: string, password: string): Promise<IUser> {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, firstName: '', lastName: '' }),
        });
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        return mapUser(data.user);
    }

    async signOut(): Promise<void> {
        try { 
            await apiRequest('/auth/logout', { method: 'POST' }); 
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            clearTokens();
        }
    }

    async editProfile(data: IEditProfileData): Promise<IUser> {
        const res = await apiRequest('/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
        return mapUser(res);
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        await apiRequest('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword: oldPassword, newPassword }),
        });
    }

    async addAddress(data: IEditAddressData): Promise<IAddress> {
        const res = await apiRequest('/users/me/addresses', {
            method: 'POST',
            body: JSON.stringify(mapAddressToApi(data)),
        });
        return mapAddress(res);
    }

    async editAddress(addressId: number, data: IEditAddressData): Promise<IAddress> {
        const res = await apiRequest(`/users/me/addresses/${addressId}`, {
            method: 'PATCH',
            body: JSON.stringify(mapAddressToApi(data)),
        });
        return mapAddress(res);
    }

    async delAddress(addressId: number): Promise<void> {
        await apiRequest(`/users/me/addresses/${addressId}`, { method: 'DELETE' });
    }

    async getDefaultAddress(): Promise<IAddress | null> {
        const addresses = await this.getAddresses();
        return addresses.find((a) => a.default) || addresses[0] || null;
    }

    async getAddress(addressId: number): Promise<IAddress> {
        const addresses = await this.getAddresses();
        const found = addresses.find((a) => a.id === addressId);
        if (!found) throw new Error('Address not found');
        return found;
    }

    async getAddresses(): Promise<IAddress[]> {
        const res = await apiRequest('/users/me/addresses');
        return (res || []).map(mapAddress);
    }

    async getOrdersList(options?: IListOptions): Promise<IOrdersList> {
        const params = new URLSearchParams();
        if (options?.page) params.set('page', String(options.page));
        if (options?.limit) params.set('limit', String(options.limit));
        if (options?.sort) params.set('sortBy', options.sort);

        const res = await apiRequest(`/orders?${params.toString()}`);
        return {
            items: (res.data || []).map(mapOrder),
            sort: options?.sort || 'default',
            navigation: {
                type: 'page',
                page: res.meta?.page || 1,
                limit: res.meta?.limit || 20,
                total: res.meta?.total || 0,
                pages: res.meta?.totalPages || 1,
                from: ((res.meta?.page || 1) - 1) * (res.meta?.limit || 20) + 1,
                to: Math.min((res.meta?.page || 1) * (res.meta?.limit || 20), res.meta?.total || 0),
            },
        };
    }

    async getOrderById(id: number): Promise<IOrder> {
        const res = await apiRequest(`/orders/${id}`);
        return mapOrder(res);
    }

    async getOrderByToken(token: string): Promise<IOrder> {
        const res = await apiRequest(`/orders/${token}`);
        return mapOrder(res);
    }
}

// ── Mappers ──────────────────────────────────────────────

function mapUser(u: any): IUser {
    return {
        email: u.email || '',
        phone: u.phone || '',
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        avatar: u.avatar || '',
    };
}

function mapAddress(a: any): IAddress {
    return {
        id: a.id,
        firstName: a.firstName || '',
        lastName: a.lastName || '',
        company: a.company || '',
        country: a.country || '',
        address1: a.address1 || a.street || '',
        address2: a.address2 || '',
        city: a.city || '',
        state: a.state || '',
        postcode: a.postcode || a.zipCode || '',
        email: a.email || '',
        phone: a.phone || '',
        default: a.isDefault || false,
    };
}

function mapAddressToApi(data: IEditAddressData): any {
    return {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        country: data.country,
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        email: data.email,
        phone: data.phone,
        isDefault: data.default,
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
            product: {
                id: item.product?.id || item.productId,
                name: item.product?.name || '',
                excerpt: item.product?.description?.slice(0, 100) || '',
                description: item.product?.description || '',
                slug: item.product?.slug || '',
                partNumber: item.product?.sku || '',
                stock: 'in-stock' as const,
                price: Number(item.price),
                compareAtPrice: null,
                images: item.product?.images?.map((img: any) => img.url) || [],
                compatibility: 'all' as const,
                brand: null,
                type: { name: 'Auto Parts', slug: 'auto-parts', attributeGroups: [] },
                attributes: [],
                options: [],
            },
            options: [],
            price: Number(item.price),
            quantity: item.quantity,
            total: Number(item.total),
        })),
        quantity: (o.items || []).reduce((sum: number, i: any) => sum + i.quantity, 0),
        subtotal: Number(o.subtotal),
        totals: [
            { title: 'Shipping', price: Number(o.shippingFee || 0) },
            { title: 'Tax', price: Number(o.tax || 0) },
        ],
        total: Number(o.total),
        shippingAddress: o.address ? mapAddressData(o.address) : emptyAddress(),
        billingAddress: o.address ? mapAddressData(o.address) : emptyAddress(),
    };
}

function mapAddressData(a: any) {
    return {
        firstName: a.firstName || '',
        lastName: a.lastName || '',
        company: a.company || '',
        country: a.country || '',
        address1: a.address1 || a.street || '',
        address2: a.address2 || '',
        city: a.city || '',
        state: a.state || '',
        postcode: a.postcode || '',
        email: a.email || '',
        phone: a.phone || '',
    };
}

function emptyAddress() {
    return { firstName: '', lastName: '', company: '', country: '', address1: '', address2: '', city: '', state: '', postcode: '', email: '', phone: '' };
}
