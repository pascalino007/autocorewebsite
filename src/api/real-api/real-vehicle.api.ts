import { IVehicle } from '~/interfaces/vehicle';
import { VehicleApi } from '~/api/base';
import { apiRequest } from '~/api/http-client';

export class RealVehicleApi extends VehicleApi {
    async getYears(): Promise<number[]> {
        const res = await apiRequest('/cars/years');
        return Array.isArray(res) ? res : [];
    }

    async getMakes(year?: number): Promise<string[]> {
        const params = year ? `?year=${year}` : '';
        const res = await apiRequest(`/cars/makes${params}`);
        return Array.isArray(res) ? res : [];
    }

    async getModels(year: number, make: string): Promise<string[]> {
        const res = await apiRequest(`/cars/models/${encodeURIComponent(make)}`);
        return Array.isArray(res) ? res : [];
    }

    async getVehicles(year: number, make: string, model: string): Promise<IVehicle[]> {
        const params = new URLSearchParams({
            year: String(year),
            make,
            model,
        });
        const res = await apiRequest(`/cars?${params.toString()}`);
        const items = Array.isArray(res) ? res : (res.data || []);
        return items.map(mapVehicle);
    }

    async getVehicleByVin(vin: string): Promise<IVehicle> {
        const res = await apiRequest(`/search/vin/${encodeURIComponent(vin)}`);
        return mapVehicle(res);
    }

    async getUserVehicles(): Promise<IVehicle[]> {
        const res = await apiRequest('/garage');
        const items = Array.isArray(res) ? res : (res.data || []);
        return items.map((g: any) => mapVehicle(g.car || g));
    }

    async addUserVehicle(vehicleId: number): Promise<void> {
        await apiRequest('/garage', {
            method: 'POST',
            body: JSON.stringify({ carId: vehicleId }),
        });
    }

    async removeUserVehicle(vehicleId: number): Promise<void> {
        await apiRequest(`/garage/${vehicleId}`, { method: 'DELETE' });
    }
}

function mapVehicle(v: any): IVehicle {
    if (!v || typeof v !== 'object') {
        return {
            id: 0,
            year: 0,
            make: '',
            model: '',
            engine: '',
        };
    }
    
    return {
        id: v.id || 0,
        year: v.year || 0,
        make: v.make || '',
        model: v.model || '',
        engine: v.engine || v.trim || '',
    };
}
