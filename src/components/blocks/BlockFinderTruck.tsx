// react
import React, { useState, useMemo } from 'react';
// third-party
import classNames from 'classnames';
import { useRouter } from 'next/router';
// application
import { baseUrl } from '~/services/utils';

const truckMakesWithModels: Record<string, string[]> = {
    'Mercedes-Benz': ['Actros', 'Atego', 'Econic', 'Unimog', 'Axor', 'Antos'],
    Volvo: ['FH', 'FH16', 'FM', 'FMX', 'FE', 'FL', 'VNR'],
    Scania: ['R-Series', 'S-Series', 'P-Series', 'G-Series', 'L-Series'],
    MAN: ['TGX', 'TGS', 'TGM', 'TGL', 'TG', 'CLA'],
    DAF: ['XF', 'CF', 'LF', 'XG', 'XG+'],
    Iveco: ['S-Way', 'T-Way', 'X-Way', 'Stralis', 'Eurocargo', 'Daily'],
    'Renault Trucks': ['T', 'T High', 'C', 'K', 'D', 'D Wide'],
    Kenworth: ['T680', 'T880', 'W990', 'T370', 'T270', 'C500'],
    Peterbilt: ['579', '567', '389', '520', '348', '337'],
    Freightliner: ['Cascadia', 'Coronado', 'Columbia', 'M2', '108SD'],
    'Western Star': ['49X', '5700XE', '4700', '4800'],
    Navistar: ['LT', 'RH', 'HV', 'HX', 'Lonestar'],
    Mack: ['Anthem', 'Pinnacle', 'Granite', 'TerraPro', 'LR'],
    Isuzu: ['Giga', 'Forward', 'Elf', 'D-Max'],
    Hino: ['700 Series', '500 Series', '300 Series'],
    Fuso: ['Super Great', 'Fighter', 'Canter', 'FE'],
};

const truckPartCategories = [
    'Moteur & Transmission',
    'Filtres (Air, Huile, Carburant)',
    'Freins & Plaquettes',
    'Pneus & Roues',
    'Système électrique & Batteries',
    'Échappement & Dépollution',
    'Suspension & Direction',
    'Refroidissement',
    'Carrosserie & Cabine',
    'Accessoires & Équipement',
];

function BlockFinderTruck() {
    const router = useRouter();
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [partCategory, setPartCategory] = useState('');

    const makes = useMemo(() => Object.keys(truckMakesWithModels).sort(), []);
    const models = useMemo(() => {
        if (!make || !truckMakesWithModels[make]) return [];
        return truckMakesWithModels[make];
    }, [make]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const query: Record<string, string> = {};
        if (make) query.truck_make = make;
        if (model) query.truck_model = model;
        if (year) query.truck_year = year;
        if (partCategory) query.truck_part_type = partCategory;
        router.push({
            pathname: '/vehicle-search',
            query: { ...query, vehicle_type: 'truck' },
        }).then();
    };

    return (
        <div className="block block-finder-truck">
            <div
                className="block-finder-truck__image"
                style={{ backgroundImage: `url(${baseUrl('/images/trucki.jpg')})` }}
            />
            <div className="block-finder-truck__body container container--max--xl">
                <div className="block-finder-truck__badge">
                    <i className="fas fa-truck" />
                    <span>CAMIONS</span>
                </div>
                <div className="block-finder-truck__title">
                    Pièces & Accessoires Poids Lourd
                </div>
                <div className="block-finder-truck__subtitle">
                    Trouvez les pièces pour votre camion, bus ou véhicule industriel
                </div>

                <form className="block-finder-truck__form" onSubmit={onSubmit}>
                    <select
                        className="block-finder-truck__control"
                        value={make}
                        onChange={(e) => { setMake(e.target.value); setModel(''); }}
                    >
                        <option value="">Marque</option>
                        {makes.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        className="block-finder-truck__control"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        disabled={!make}
                    >
                        <option value="">{make ? 'Modèle' : 'Choisir marque'}</option>
                        {models.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <select
                        className="block-finder-truck__control"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    >
                        <option value="">Année</option>
                        {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <select
                        className="block-finder-truck__control"
                        value={partCategory}
                        onChange={(e) => setPartCategory(e.target.value)}
                    >
                        <option value="">Type de pièce</option>
                        {truckPartCategories.map((pc) => (
                            <option key={pc} value={pc}>{pc}</option>
                        ))}
                    </select>
                    <button className="block-finder-truck__button" type="submit">
                        <i className="fas fa-search" />
                        <span>Rechercher</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default React.memo(BlockFinderTruck);
