// react
import React, { useState, useMemo } from 'react';
// third-party
import classNames from 'classnames';
import { useRouter } from 'next/router';
// application
import Decor from '~/components/shared/Decor';
import { baseUrl } from '~/services/utils';

type FinderTab = 'moto' | 'vin';

const motoModelsByBrand: Record<string, string[]> = {
    Honda: ['CBR 600RR', 'CBR 1000RR', 'CB500F', 'CB650R', 'CRF 250L', 'CRF 450R', 'Africa Twin', 'Forza 350', 'PCX 125', 'SH 150', 'X-ADV'],
    Yamaha: ['MT-07', 'MT-09', 'YZF-R1', 'YZF-R3', 'YZF-R6', 'XSR 700', 'Ténéré 700', 'NMAX 125', 'XMAX 300', 'Tracer 9', 'FZ-S'],
    Suzuki: ['GSX-R750', 'GSX-R1000', 'V-Strom 650', 'V-Strom 1050', 'SV650', 'Hayabusa', 'Burgman 400', 'DR-Z400', 'GSX-S750'],
    Kawasaki: ['Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja 400', 'Z650', 'Z900', 'Versys 650', 'KLR 650', 'Vulcan S', 'KX 450'],
    BMW: ['R1250 GS', 'R1250 RT', 'S1000RR', 'S1000XR', 'F850 GS', 'F900R', 'G310R', 'G310 GS', 'C400X', 'CE 04'],
    Ducati: ['Panigale V4', 'Panigale V2', 'Monster', 'Multistrada V4', 'Scrambler', 'Diavel', 'Streetfighter V4', 'Hypermotard 950'],
    KTM: ['Duke 390', 'Duke 790', 'Duke 890', 'RC 390', '450 EXC-F', '690 Enduro', '1290 Super Duke', '1290 Super Adventure', '890 Adventure'],
    'Harley-Davidson': ['Sportster S', 'Iron 883', 'Fat Boy', 'Road Glide', 'Street Glide', 'Road King', 'Pan America', 'Nightster', 'Breakout'],
    Triumph: ['Street Triple', 'Speed Triple', 'Tiger 900', 'Tiger 1200', 'Trident 660', 'Bonneville T120', 'Scrambler 1200', 'Rocket 3'],
    Aprilia: ['RSV4', 'RS 660', 'Tuono V4', 'Tuono 660', 'Tuareg 660', 'SR GT 125'],
    TVS: ['Apache RTR 200', 'Apache RTR 160', 'Apache RR 310', 'Ntorq 125', 'Jupiter 125', 'Raider 125'],
    Bajaj: ['Pulsar NS200', 'Pulsar RS200', 'Pulsar 220F', 'Dominar 400', 'Avenger 220', 'CT 125'],
    Hero: ['Xtreme 160R', 'Xpulse 200', 'Glamour 125', 'Splendor Plus', 'HF Deluxe', 'Destini 125'],
    'Royal Enfield': ['Classic 350', 'Meteor 350', 'Hunter 350', 'Himalayan', 'Continental GT 650', 'Interceptor 650', 'Super Meteor 650'],
    Piaggio: ['MP3 500', 'Beverly 400', 'Medley 150', 'Liberty 150'],
    Vespa: ['GTS 300', 'Primavera 150', 'Sprint 150', 'Elettrica'],
};

function BlockFinderMoto() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<FinderTab>('moto');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [partType, setPartType] = useState('');
    const [vinInput, setVinInput] = useState('');

    const motoBrands = Object.keys(motoModelsByBrand).sort();

    const availableModels = useMemo(() => {
        if (!brand || !motoModelsByBrand[brand]) return [];
        return motoModelsByBrand[brand];
    }, [brand]);

    const motoPartTypes = [
        'Moteur & Transmission',
        'Freins & Plaquettes',
        'Filtres (Air, Huile, Carburant)',
        'Pneus & Jantes',
        'Chaîne & Pignons',
        'Éclairage & Électrique',
        'Carénage & Carrosserie',
        'Échappement',
        'Suspension',
        'Embrayage',
        'Batterie',
        'Accessoires',
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

    const onSubmitMoto = (event: React.FormEvent) => {
        event.preventDefault();

        const query: Record<string, string> = {};
        if (brand) query.moto_brand = brand;
        if (model) query.moto_model = model;
        if (year) query.moto_year = year;
        if (partType) query.moto_part_type = partType;

        // Also pass as filters for the shop
        if (brand) query.filter_brand = brand;
        if (partType) query.filter_part_type = partType;

        router.push({
            pathname: '/vehicle-search',
            query,
        }).then();
    };

    const onSubmitVin = (event: React.FormEvent) => {
        event.preventDefault();

        if (!vinInput.trim()) {
            return;
        }

        router.push({
            pathname: '/vehicle-search',
            query: { vin: vinInput.trim() },
        }).then();
    };

    return (
        <div className="block block-finder-moto">
            <Decor className="block-finder-moto__decor" type="bottom" />
            <div
                className="block-finder-moto__image"
                style={{ backgroundImage: `url(${baseUrl('/images/finder.jpg')})` }}
            />
            <div className="block-finder-moto__overlay" />
            <div className="block-finder-moto__body container container--max--xl">
                <div className="block-finder-moto__badge">
                    <i className="fas fa-motorcycle" />
                    <span>MOTO</span>
                </div>
                <div className="block-finder-moto__title">
                    Pièces & Accessoires Moto
                </div>
                <div className="block-finder-moto__subtitle">
                    Trouvez les pièces exactes pour votre moto, scooter ou quad
                </div>

                {/* Tabs */}
                <div className="finder-tabs finder-tabs--moto">
                    <button
                        type="button"
                        className={classNames('finder-tabs__tab', {
                            'finder-tabs__tab--active': activeTab === 'moto',
                        })}
                        onClick={() => setActiveTab('moto')}
                    >
                        <i className="fas fa-motorcycle" />
                        <span>Sélection moto</span>
                    </button>
                    <button
                        type="button"
                        className={classNames('finder-tabs__tab', {
                            'finder-tabs__tab--active': activeTab === 'vin',
                        })}
                        onClick={() => setActiveTab('vin')}
                    >
                        <i className="fas fa-barcode" />
                        <span>Recherche par VIN</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="finder-tabs__content">
                    {activeTab === 'moto' && (
                        <form className="block-finder-moto__form" onSubmit={onSubmitMoto}>
                            <select
                                className="block-finder-moto__control"
                                value={brand}
                                onChange={(e) => { setBrand(e.target.value); setModel(''); }}
                            >
                                <option value="">Marque</option>
                                {motoBrands.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                            <select
                                className="block-finder-moto__control block-finder-moto__control--select"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                disabled={!brand}
                            >
                                <option value="">{brand ? 'Modèle' : 'Choisir marque d\'abord'}</option>
                                {availableModels.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <select
                                className="block-finder-moto__control"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="">Année</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <select
                                className="block-finder-moto__control"
                                value={partType}
                                onChange={(e) => setPartType(e.target.value)}
                            >
                                <option value="">Type de pièce</option>
                                {motoPartTypes.map((pt) => (
                                    <option key={pt} value={pt}>{pt}</option>
                                ))}
                            </select>
                            <button className="block-finder-moto__button" type="submit">
                                <i className="fas fa-search" />
                                <span>Rechercher</span>
                            </button>
                        </form>
                    )}

                    {activeTab === 'vin' && (
                        <form className="finder-vin finder-vin--moto" onSubmit={onSubmitVin}>
                            <div className="finder-vin__desc">
                                <i className="fas fa-info-circle" />
                                <span>
                                    Le numéro VIN (Vehicle Identification Number) se trouve sur le cadre
                                    de votre moto ou sur la carte grise.
                                </span>
                            </div>
                            <div className="finder-vin__row">
                                <input
                                    type="text"
                                    className="finder-vin__input"
                                    placeholder="Entrez votre numéro VIN (17 caractères)"
                                    value={vinInput}
                                    onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                                    maxLength={17}
                                />
                                <button type="submit" className="finder-vin__btn">
                                    <i className="fas fa-search" />
                                    <span>Rechercher</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockFinderMoto);
