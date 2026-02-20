export interface IShop {
    id: number;
    name: string;
    slug: string;
    image: string;
    country: string;
    latitude?: number;
    longitude?: number;
    city?: string;
    address?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    rating?: number;
    reviewCount?: number;
}
