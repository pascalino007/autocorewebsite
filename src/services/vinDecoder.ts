/**
 * VIN Decoder Utility
 *
 * Decodes a 17-character VIN (Vehicle Identification Number) into
 * human-readable vehicle information based on the standard structure:
 *
 * Positions 1-3:  WMI (World Manufacturer Identifier)
 * Position  10:   Model Year
 * Positions 4-8:  VDS (Vehicle Descriptor Section)
 * Positions 12-17: Production Sequence Number
 */

export interface IDecodedVin {
    vin: string;
    valid: boolean;
    manufacturer: string;
    country: string;
    year: string;
    type: 'auto' | 'moto' | 'unknown';
    bodyStyle: string;
    engineType: string;
    serialNumber: string;
}

// WMI -> Manufacturer mapping (first 3 chars of VIN)
const WMI_MAP: Record<string, { manufacturer: string; country: string }> = {
    // Japan
    JHM: { manufacturer: 'Honda', country: 'Japon' },
    JTD: { manufacturer: 'Toyota', country: 'Japon' },
    JTE: { manufacturer: 'Toyota', country: 'Japon' },
    JTH: { manufacturer: 'Lexus', country: 'Japon' },
    JN1: { manufacturer: 'Nissan', country: 'Japon' },
    JF1: { manufacturer: 'Subaru', country: 'Japon' },
    JMZ: { manufacturer: 'Mazda', country: 'Japon' },
    JS1: { manufacturer: 'Suzuki', country: 'Japon' },
    JYA: { manufacturer: 'Yamaha', country: 'Japon' },
    JKA: { manufacturer: 'Kawasaki', country: 'Japon' },
    // Germany
    WBA: { manufacturer: 'BMW', country: 'Allemagne' },
    WBS: { manufacturer: 'BMW M', country: 'Allemagne' },
    WDB: { manufacturer: 'Mercedes-Benz', country: 'Allemagne' },
    WDD: { manufacturer: 'Mercedes-Benz', country: 'Allemagne' },
    WDC: { manufacturer: 'Mercedes-Benz', country: 'Allemagne' },
    WAU: { manufacturer: 'Audi', country: 'Allemagne' },
    WVW: { manufacturer: 'Volkswagen', country: 'Allemagne' },
    WP0: { manufacturer: 'Porsche', country: 'Allemagne' },
    // USA
    '1G1': { manufacturer: 'Chevrolet', country: 'États-Unis' },
    '1FA': { manufacturer: 'Ford', country: 'États-Unis' },
    '1FT': { manufacturer: 'Ford Truck', country: 'États-Unis' },
    '1HD': { manufacturer: 'Harley-Davidson', country: 'États-Unis' },
    '2HM': { manufacturer: 'Hyundai', country: 'États-Unis' },
    '3FA': { manufacturer: 'Ford (Mexico)', country: 'Mexique' },
    // Korea
    KMH: { manufacturer: 'Hyundai', country: 'Corée du Sud' },
    KNA: { manufacturer: 'Kia', country: 'Corée du Sud' },
    // Italy
    ZAR: { manufacturer: 'Alfa Romeo', country: 'Italie' },
    ZFF: { manufacturer: 'Ferrari', country: 'Italie' },
    ZDM: { manufacturer: 'Ducati', country: 'Italie' },
    ZAM: { manufacturer: 'Maserati', country: 'Italie' },
    // France
    VF1: { manufacturer: 'Renault', country: 'France' },
    VF3: { manufacturer: 'Peugeot', country: 'France' },
    VF7: { manufacturer: 'Citroën', country: 'France' },
    // UK
    SAJ: { manufacturer: 'Jaguar', country: 'Royaume-Uni' },
    SAL: { manufacturer: 'Land Rover', country: 'Royaume-Uni' },
    SCF: { manufacturer: 'Aston Martin', country: 'Royaume-Uni' },
    SMT: { manufacturer: 'Triumph', country: 'Royaume-Uni' },
    // Austria
    VBK: { manufacturer: 'KTM', country: 'Autriche' },
    // India
    MD2: { manufacturer: 'Bajaj', country: 'Inde' },
    MBH: { manufacturer: 'Hero', country: 'Inde' },
    MA3: { manufacturer: 'Suzuki India', country: 'Inde' },
    MAK: { manufacturer: 'Honda India', country: 'Inde' },
    ME1: { manufacturer: 'Royal Enfield', country: 'Inde' },
    MBL: { manufacturer: 'TVS', country: 'Inde' },
};

// Model year character (position 10)
const YEAR_MAP: Record<string, string> = {
    A: '2010', B: '2011', C: '2012', D: '2013', E: '2014',
    F: '2015', G: '2016', H: '2017', J: '2018', K: '2019',
    L: '2020', M: '2021', N: '2022', P: '2023', R: '2024',
    S: '2025', T: '2026', V: '2027', W: '2028', X: '2029',
    Y: '2030', '1': '2031', '2': '2032', '3': '2033',
    '4': '2034', '5': '2035', '6': '2036', '7': '2037',
    '8': '2038', '9': '2039',
};

// Moto manufacturer WMIs
const MOTO_WMIS = new Set([
    'JYA', 'JKA', 'JS1', 'ZDM', 'SMT', 'VBK',
    'MD2', 'MBH', 'ME1', 'MBL', '1HD',
]);

function isValidVin(vin: string): boolean {
    return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
}

export function decodeVin(vin: string): IDecodedVin {
    const v = vin.toUpperCase().trim();

    if (!isValidVin(v)) {
        return {
            vin: v,
            valid: false,
            manufacturer: '',
            country: '',
            year: '',
            type: 'unknown',
            bodyStyle: '',
            engineType: '',
            serialNumber: '',
        };
    }

    const wmi = v.substring(0, 3);
    const yearChar = v.charAt(9);
    const serial = v.substring(11);

    const mfgInfo = WMI_MAP[wmi] || { manufacturer: 'Inconnu', country: 'Inconnu' };
    const year = YEAR_MAP[yearChar] || '';
    const isMoto = MOTO_WMIS.has(wmi);

    // Derive body style from VDS (positions 4-8) — simplified
    const vds = v.substring(3, 8);
    let bodyStyle = 'Berline';
    if (isMoto) {
        bodyStyle = 'Moto';
    } else if (vds.includes('T') || vds.includes('K')) {
        bodyStyle = 'SUV / Crossover';
    } else if (vds.includes('W') || vds.includes('V')) {
        bodyStyle = 'Break / Wagon';
    } else if (vds.includes('C') || vds.includes('S')) {
        bodyStyle = 'Coupé / Sport';
    }

    // Engine type hint from VDS
    let engineType = 'Essence';
    if (vds.includes('D') || vds.includes('L')) {
        engineType = 'Diesel';
    } else if (vds.includes('E') || vds.includes('H')) {
        engineType = 'Hybride / Électrique';
    }

    return {
        vin: v,
        valid: true,
        manufacturer: mfgInfo.manufacturer,
        country: mfgInfo.country,
        year,
        type: isMoto ? 'moto' : 'auto',
        bodyStyle,
        engineType,
        serialNumber: serial,
    };
}
