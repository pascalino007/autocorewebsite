// react
import React, { useState, useMemo, useCallback } from 'react';
// third-party
import classNames from 'classnames';
import { useRouter } from 'next/router';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import VehicleCard from '~/components/shared/VehicleCard';
import VehicleSelect from '~/components/shared/VehicleSelect';
import url from '~/services/url';
import usedVehiclesData, {
    getUniqueColors,
    getUniqueBrands,
    getUniqueBodyStyles,
    getUniqueTransmissions,
    getUniqueFuelTypes,
    getUniqueConditions,
} from '~/data/usedVehicles';
import { IVehicle } from '~/interfaces/vehicle';

type SearchTab = 'vehicle' | 'vin';
type VehicleTypeFilter = 'all' | 'car' | 'moto';

function UsedVehiclesPage() {
    const router = useRouter();

    // ----- Search bar state -----
    const [activeTab, setActiveTab] = useState<SearchTab>('vehicle');
    const [vehicle, setVehicle] = useState<IVehicle | null>(null);
    const [vinInput, setVinInput] = useState('');

    // ----- Filter state -----
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<VehicleTypeFilter>('all');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedBodyStyles, setSelectedBodyStyles] = useState<string[]>([]);
    const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
    const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>('newest');

    // ----- Sidebar collapse state (mobile) -----
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ----- Filter options -----
    const allColors = useMemo(() => getUniqueColors(usedVehiclesData), []);
    const allBrands = useMemo(() => getUniqueBrands(usedVehiclesData), []);
    const allBodyStyles = useMemo(() => getUniqueBodyStyles(usedVehiclesData), []);
    const allTransmissions = useMemo(() => getUniqueTransmissions(usedVehiclesData), []);
    const allFuelTypes = useMemo(() => getUniqueFuelTypes(usedVehiclesData), []);
    const allConditions = useMemo(() => getUniqueConditions(usedVehiclesData), []);

    // ----- Toggle helpers -----
    const toggleArrayFilter = useCallback((arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
        setArr((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
    }, []);

    // ----- Filter vehicles -----
    const filteredVehicles = useMemo(() => {
        let list = [...usedVehiclesData];

        // Type filter
        if (vehicleTypeFilter !== 'all') {
            list = list.filter((v) => v.type === vehicleTypeFilter);
        }

        // Price filter
        const pMin = parseFloat(priceMin);
        const pMax = parseFloat(priceMax);
        if (!isNaN(pMin)) list = list.filter((v) => v.price >= pMin);
        if (!isNaN(pMax)) list = list.filter((v) => v.price <= pMax);

        // Multi-select filters
        if (selectedColors.length > 0) list = list.filter((v) => selectedColors.includes(v.color));
        if (selectedBrands.length > 0) list = list.filter((v) => selectedBrands.includes(v.brand));
        if (selectedBodyStyles.length > 0) list = list.filter((v) => selectedBodyStyles.includes(v.bodyStyle));
        if (selectedTransmissions.length > 0) list = list.filter((v) => selectedTransmissions.includes(v.transmission));
        if (selectedFuelTypes.length > 0) list = list.filter((v) => selectedFuelTypes.includes(v.fuelType));
        if (selectedConditions.length > 0) list = list.filter((v) => selectedConditions.includes(v.condition));

        // Sort
        switch (sortBy) {
            case 'price-asc':
                list.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                list.sort((a, b) => b.price - a.price);
                break;
            case 'year-desc':
                list.sort((a, b) => b.year - a.year);
                break;
            case 'mileage-asc':
                list.sort((a, b) => a.mileage - b.mileage);
                break;
            case 'newest':
            default:
                list.sort((a, b) => b.id - a.id);
                break;
        }

        return list;
    }, [vehicleTypeFilter, priceMin, priceMax, selectedColors, selectedBrands, selectedBodyStyles, selectedTransmissions, selectedFuelTypes, selectedConditions, sortBy]);

    // ----- Search handlers -----
    const onSubmitVehicle = (event: React.FormEvent) => {
        event.preventDefault();
        if (!vehicle) return;

        router.push({
            pathname: '/vehicle-search',
            query: {
                vehicle_id: vehicle.id.toString(),
                year: vehicle.year.toString(),
                make: vehicle.make,
                model: vehicle.model,
                engine: vehicle.engine,
                filter_vehicle: vehicle.id.toString(),
            },
        }).then();
    };

    const onSubmitVin = (event: React.FormEvent) => {
        event.preventDefault();
        if (!vinInput.trim()) return;

        router.push({
            pathname: '/vehicle-search',
            query: { vin: vinInput.trim() },
        }).then();
    };

    // ----- Reset filters -----
    const resetFilters = () => {
        setVehicleTypeFilter('all');
        setPriceMin('');
        setPriceMax('');
        setSelectedColors([]);
        setSelectedBrands([]);
        setSelectedBodyStyles([]);
        setSelectedTransmissions([]);
        setSelectedFuelTypes([]);
        setSelectedConditions([]);
        setSortBy('newest');
    };

    const activeFilterCount =
        (vehicleTypeFilter !== 'all' ? 1 : 0) +
        (priceMin ? 1 : 0) +
        (priceMax ? 1 : 0) +
        selectedColors.length +
        selectedBrands.length +
        selectedBodyStyles.length +
        selectedTransmissions.length +
        selectedFuelTypes.length +
        selectedConditions.length;

    // ----- Render filter checkbox group -----
    const renderFilterGroup = (title: string, icon: string, options: string[], selected: string[], setSelected: React.Dispatch<React.SetStateAction<string[]>>) => (
        <div className="uv-filter__group">
            <h4 className="uv-filter__group-title">
                <i className={icon} />
                {title}
            </h4>
            <div className="uv-filter__options">
                {options.map((opt) => (
                    <label key={opt} className="uv-filter__checkbox">
                        <input
                            type="checkbox"
                            checked={selected.includes(opt)}
                            onChange={() => toggleArrayFilter(selected, setSelected, opt)}
                        />
                        <span className="uv-filter__checkbox-label">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <React.Fragment>
            <PageTitle>Véhicules d&apos;occasion</PageTitle>

            <BlockHeader
                pageTitle="Véhicules d'occasion"
                breadcrumb={[
                    { title: 'Accueil', url: url.home() },
                    { title: 'Véhicules d\'occasion', url: url.usedVehicles() },
                ]}
            />

            {/* Hero / Search Section */}
            <div className="uv-hero">
                <div className="container">
                    <div className="uv-hero__inner">
                        <h2 className="uv-hero__title">
                            <i className="fas fa-car-alt" />
                            Trouvez votre véhicule d&apos;occasion
                        </h2>
                        <p className="uv-hero__subtitle">
                            Voitures et motos certifiées, inspectées et prêtes à rouler
                        </p>

                        {/* Search Tabs */}
                        <div className="uv-search-tabs">
                            <button
                                type="button"
                                className={classNames('uv-search-tabs__tab', {
                                    'uv-search-tabs__tab--active': activeTab === 'vehicle',
                                })}
                                onClick={() => setActiveTab('vehicle')}
                            >
                                <i className="fas fa-car" />
                                <span>Sélection véhicule</span>
                            </button>
                            <button
                                type="button"
                                className={classNames('uv-search-tabs__tab', {
                                    'uv-search-tabs__tab--active': activeTab === 'vin',
                                })}
                                onClick={() => setActiveTab('vin')}
                            >
                                <i className="fas fa-barcode" />
                                <span>Recherche par VIN</span>
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="uv-search-tabs__content">
                            {activeTab === 'vehicle' && (
                                <form className="uv-search-form" onSubmit={onSubmitVehicle}>
                                    <VehicleSelect className="uv-search-form__select" onVehicleChange={setVehicle} />
                                    <button className="uv-search-form__btn" type="submit">
                                        <i className="fas fa-search" />
                                        <span>Rechercher</span>
                                    </button>
                                </form>
                            )}

                            {activeTab === 'vin' && (
                                <form className="uv-vin-form" onSubmit={onSubmitVin}>
                                    <div className="uv-vin-form__desc">
                                        <i className="fas fa-info-circle" />
                                        <span>
                                            Entrez le VIN (Vehicle Identification Number) de votre véhicule pour trouver des pièces compatibles.
                                        </span>
                                        </div>
                                    <div className="uv-vin-form__row">
                                        <input
                                            type="text"
                                            className="uv-vin-form__input"
                                            placeholder="Entrez votre VIN (17 caractères)"
                                            value={vinInput}
                                            onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                                            maxLength={17}
                                        />
                                        <button type="submit" className="uv-vin-form__btn">
                                            <i className="fas fa-search" />
                                            <span>Rechercher</span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Sidebar + Grid */}
            <div className="uv-page">
                <div className="container">
                    {/* Top bar: sort + count + mobile toggle */}
                    <div className="uv-topbar">
                        <div className="uv-topbar__left">
                            <button
                                type="button"
                                className="uv-topbar__filter-toggle"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <i className="fas fa-sliders-h" />
                                <span>Filtres</span>
                                {activeFilterCount > 0 && (
                                    <span className="uv-topbar__filter-badge">{activeFilterCount}</span>
                                )}
                            </button>
                            <span className="uv-topbar__count">
                                {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="uv-topbar__right">
                            {/* Vehicle type toggle */}
                            <div className="uv-type-toggle">
                                {(['all', 'car', 'moto'] as VehicleTypeFilter[]).map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={classNames('uv-type-toggle__btn', {
                                            'uv-type-toggle__btn--active': vehicleTypeFilter === t,
                                        })}
                                        onClick={() => setVehicleTypeFilter(t)}
                                    >
                                        {t === 'all' && <><i className="fas fa-th" /><span>Tous</span></>}
                                        {t === 'car' && <><i className="fas fa-car" /><span>Voitures</span></>}
                                        {t === 'moto' && <><i className="fas fa-motorcycle" /><span>Motos</span></>}
                                    </button>
                                ))}
                                </div>

                            <select
                                className="uv-topbar__sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Plus récent</option>
                                <option value="price-asc">Prix croissant</option>
                                <option value="price-desc">Prix décroissant</option>
                                <option value="year-desc">Année récente</option>
                                <option value="mileage-asc">Kilométrage bas</option>
                            </select>
                        </div>
                    </div>

                    <div className="uv-layout">
                        {/* Sidebar */}
                        <aside className={classNames('uv-sidebar', { 'uv-sidebar--open': sidebarOpen })}>
                            {/* Mobile close */}
                            <div className="uv-sidebar__header">
                                <h3 className="uv-sidebar__title">
                                    <i className="fas fa-filter" />
                                    Filtres
                                </h3>
                                <button
                                    type="button"
                                    className="uv-sidebar__close"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <i className="fas fa-times" />
                                </button>
                                        </div>

                            <div className="uv-sidebar__body">
                                {/* Price range */}
                                <div className="uv-filter__group">
                                    <h4 className="uv-filter__group-title">
                                        <i className="fas fa-tag" />
                                        Prix (FCFA)
                                    </h4>
                                    <div className="uv-filter__price-row">
                                        <input
                                            type="number"
                                            className="uv-filter__price-input"
                                            placeholder="Min"
                                            value={priceMin}
                                            onChange={(e) => setPriceMin(e.target.value)}
                                        />
                                        <span className="uv-filter__price-sep">&mdash;</span>
                                        <input
                                            type="number"
                                            className="uv-filter__price-input"
                                            placeholder="Max"
                                            value={priceMax}
                                            onChange={(e) => setPriceMax(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {renderFilterGroup('Couleur', 'fas fa-palette', allColors, selectedColors, setSelectedColors)}
                                {renderFilterGroup('Marque', 'fas fa-industry', allBrands, selectedBrands, setSelectedBrands)}
                                {renderFilterGroup('Carrosserie', 'fas fa-car-side', allBodyStyles, selectedBodyStyles, setSelectedBodyStyles)}
                                {renderFilterGroup('Transmission', 'fas fa-cog', allTransmissions, selectedTransmissions, setSelectedTransmissions)}
                                {renderFilterGroup('Carburant', 'fas fa-gas-pump', allFuelTypes, selectedFuelTypes, setSelectedFuelTypes)}
                                {renderFilterGroup('État', 'fas fa-certificate', allConditions, selectedConditions, setSelectedConditions)}

                                {/* Reset */}
                                {activeFilterCount > 0 && (
                                    <button
                                        type="button"
                                        className="uv-filter__reset"
                                        onClick={resetFilters}
                                    >
                                        <i className="fas fa-undo" />
                                        Réinitialiser les filtres
                                    </button>
                                )}
                            </div>
                        </aside>

                        {/* Overlay for mobile sidebar */}
                        {sidebarOpen && (
                            <div
                                className="uv-sidebar-overlay"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}

                        {/* Grid */}
                        <div className="uv-grid">
                            {filteredVehicles.length === 0 && (
                                <div className="uv-grid__empty">
                                    <i className="fas fa-search" />
                                    <h3>Aucun véhicule trouvé</h3>
                                    <p>Essayez de modifier vos critères de recherche</p>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={resetFilters}>
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            )}

                            <div className="uv-grid__list">
                                {filteredVehicles.map((v) => (
                                    <VehicleCard key={v.id} vehicle={v} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default UsedVehiclesPage;
