// react
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface IUserLocation {
    country: string;
    countryCode: string;
    city: string;
    region: string;
    latitude: number;
    longitude: number;
    address: string;
    loaded: boolean;
}

const defaultLocation: IUserLocation = {
    country: '',
    countryCode: '',
    city: '',
    region: '',
    latitude: 0,
    longitude: 0,
    address: '',
    loaded: false,
};

const UserLocationContext = createContext<IUserLocation>(defaultLocation);

/**
 * Reverse-geocode lat/lng using OpenStreetMap Nominatim.
 */
async function reverseGeocode(lat: number, lng: number): Promise<{
    city: string;
    region: string;
    country: string;
    countryCode: string;
    address: string;
}> {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`,
        { headers: { 'User-Agent': 'AkodessewaCom/1.0' } },
    );
    const data = await res.json();
    const addr = data?.address || {};

    const city = addr.city || addr.town || addr.village || addr.hamlet || '';
    const region = addr.state || addr.county || '';
    const country = addr.country || '';
    const countryCode = (data?.address?.country_code || '').toUpperCase();
    const road = addr.road || addr.pedestrian || '';
    const neighbourhood = addr.neighbourhood || addr.suburb || '';

    // Build a readable address: road, neighbourhood, city
    const addressParts = [road, neighbourhood, city, country].filter(Boolean);
    const address = addressParts.join(', ');

    return { city, region, country, countryCode, address };
}

export function UserLocationProvider({ children }: { children: React.ReactNode }) {
    const [location, setLocation] = useState<IUserLocation>(defaultLocation);

    useEffect(() => {
        // Step 1: Try browser geolocation for precise lat/lng
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        // Step 2: Reverse-geocode via OpenStreetMap Nominatim
                        const geo = await reverseGeocode(latitude, longitude);

                        setLocation({
                            country: geo.country,
                            countryCode: geo.countryCode,
                            city: geo.city,
                            region: geo.region,
                            latitude,
                            longitude,
                            address: geo.address,
                            loaded: true,
                        });
                    } catch {
                        // Nominatim failed but we still have coordinates
                        setLocation({
                            ...defaultLocation,
                            latitude,
                            longitude,
                            loaded: true,
                        });
                    }
                },
                () => {
                    // Geolocation denied or unavailable — fallback to IP-based
                    fetchIpFallback(setLocation);
                },
                { enableHighAccuracy: false, timeout: 8000, maximumAge: 0 },
            );
        } else {
            // No geolocation API — fallback to IP
            fetchIpFallback(setLocation);
        }
    }, []);

    return (
        <UserLocationContext.Provider value={location}>
            {children}
        </UserLocationContext.Provider>
    );
}

/**
 * Fallback: get approximate location from IP, then reverse-geocode via Nominatim.
 */
function fetchIpFallback(setLocation: React.Dispatch<React.SetStateAction<IUserLocation>>) {
    fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then(async (data) => {
            if (data && data.latitude && data.longitude) {
                try {
                    const geo = await reverseGeocode(data.latitude, data.longitude);

                    setLocation({
                        country: geo.country,
                        countryCode: geo.countryCode || (data.country_code || '').toUpperCase(),
                        city: geo.city,
                        region: geo.region,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        address: geo.address,
                        loaded: true,
                    });
                } catch {
                    // Nominatim failed, use ipapi data directly
                    const city = data.city || '';
                    const country = data.country_name || '';
                    const parts = [city, country].filter(Boolean);

                    setLocation({
                        country,
                        countryCode: (data.country_code || '').toUpperCase(),
                        city,
                        region: data.region || '',
                        latitude: data.latitude,
                        longitude: data.longitude,
                        address: parts.join(', '),
                        loaded: true,
                    });
                }
            } else {
                setLocation({ ...defaultLocation, loaded: true });
            }
        })
        .catch(() => {
            setLocation({ ...defaultLocation, loaded: true });
        });
}

export function useUserLocation(): IUserLocation {
    return useContext(UserLocationContext);
}

/**
 * Haversine formula: calculates the distance in km between two lat/lng points.
 */
export function haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos((lat1 * Math.PI) / 180)
        * Math.cos((lat2 * Math.PI) / 180)
        * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Country coordinates lookup for suppliers.
 * Keys: ISO 2-letter codes. Use getCountryCoords() to resolve by code or name.
 */
export const COUNTRY_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
    TG: { lat: 6.1375, lng: 1.2123, name: 'Togo' },
    GH: { lat: 5.6037, lng: -0.1870, name: 'Ghana' },
    NG: { lat: 6.5244, lng: 3.3792, name: 'Nigeria' },
    BJ: { lat: 6.3703, lng: 2.3912, name: 'Bénin' },
    CI: { lat: 5.3600, lng: -4.0083, name: "Côte d'Ivoire" },
    SN: { lat: 14.6928, lng: -17.4467, name: 'Sénégal' },
    DE: { lat: 50.1109, lng: 8.6821, name: 'Allemagne' },
    FR: { lat: 48.8566, lng: 2.3522, name: 'France' },
    CN: { lat: 31.2304, lng: 121.4737, name: 'Chine' },
    US: { lat: 40.7128, lng: -74.0060, name: 'États-Unis' },
    JP: { lat: 35.6762, lng: 139.6503, name: 'Japon' },
    GB: { lat: 51.5074, lng: -0.1278, name: 'Royaume-Uni' },
};

/** Resolve coords by country code (e.g. TG) or country name (e.g. Togo). */
export function getCountryCoords(country: string | null | undefined): { lat: number; lng: number } | null {
    if (!country || !country.trim()) return null;
    const key = country.trim().toUpperCase();
    if (key.length === 2 && COUNTRY_COORDS[key]) return COUNTRY_COORDS[key];
    const byName = Object.entries(COUNTRY_COORDS).find(
        ([, v]) => v.name.toLowerCase() === country.trim().toLowerCase(),
    );
    return byName ? byName[1] : null;
}
