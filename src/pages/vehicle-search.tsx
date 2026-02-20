// react
import React, { useMemo } from 'react';
// third-party
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import ProductsView from '~/components/shop/ProductsView';
import ShopSidebar from '~/components/shop/ShopSidebar';
import url from '~/services/url';
import { CurrentVehicleScopeProvider } from '~/services/current-vehicle';
import { decodeVin, IDecodedVin } from '~/services/vinDecoder';
import { ILink } from '~/interfaces/link';
import { SidebarProvider } from '~/services/sidebar';
import { shopInitThunk } from '~/store/shop/shopActions';
import { wrapper } from '~/store/store';
import { AppDispatch } from '~/store/types';
import { parseQueryOptions, parseQueryFilters, buildQuery } from '~/store/shop/shopHelpers';
import { useShop } from '~/store/shop/shopHooks';
import queryString from 'query-string';
import PageTitle from '~/components/shared/PageTitle';

interface Props {
    mode: 'vin' | 'vehicle' | 'moto';
    vin?: string;
    decoded?: IDecodedVin;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehicleEngine?: string;
    vehicleId?: string;
    motoBrand?: string;
    motoModel?: string;
    motoYear?: string;
    motoPartType?: string;
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context: GetServerSidePropsContext) => {
    const { query } = context;

    let mode: 'vin' | 'vehicle' | 'moto' = 'vehicle';
    let decoded: IDecodedVin | null = null;
    const props: Record<string, any> = {};

    // Parse what mode we're in
    if (typeof query.vin === 'string' && query.vin.trim()) {
        mode = 'vin';
        decoded = decodeVin(query.vin);
        props.vin = query.vin;
        props.decoded = decoded;
    } else if (typeof query.moto_brand === 'string') {
        mode = 'moto';
        props.motoBrand = query.moto_brand || '';
        props.motoModel = (query.moto_model as string) || '';
        props.motoYear = (query.moto_year as string) || '';
        props.motoPartType = (query.moto_part_type as string) || '';
    } else {
        mode = 'vehicle';
        props.vehicleId = (query.vehicle_id as string) || '';
        props.vehicleMake = (query.make as string) || '';
        props.vehicleModel = (query.model as string) || '';
        props.vehicleYear = (query.year as string) || '';
        props.vehicleEngine = (query.engine as string) || '';
    }

    // Initialize the shop state with appropriate filters
    if (typeof context.req.url === 'string') {
        const qs = queryString.stringify(queryString.parseUrl(context.req.url).query);
        const options = parseQueryOptions(qs);
        const filters = parseQueryFilters(qs);

        // Apply vehicle filter if we have a vehicle ID
        if (props.vehicleId) {
            filters.vehicle = props.vehicleId;
        }

        const dispatch = store.dispatch as AppDispatch;
        await dispatch(shopInitThunk(null, options, filters));
    }

    return {
        props: {
            mode,
            ...props,
        },
    };
});

function VehicleSearchPage(props: Props) {
    const {
        mode,
        vin,
        decoded,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        vehicleEngine,
        motoBrand,
        motoModel,
        motoYear,
        motoPartType,
    } = props;

    const router = useRouter();
    const shopState = useShop();

    // Build title and breadcrumb
    const pageInfo = useMemo(() => {
        let title = 'Recherche de pièces';
        let subtitle = '';
        const breadcrumb: ILink[] = [
            { title: 'Accueil', url: url.home() },
        ];

        if (mode === 'vin' && decoded) {
            if (decoded.valid) {
                title = `${decoded.manufacturer} ${decoded.year}`;
                subtitle = `VIN: ${decoded.vin}`;
            } else {
                title = 'VIN invalide';
                subtitle = `Le numéro "${vin}" n'est pas un VIN valide`;
            }
            breadcrumb.push({ title: 'Recherche par VIN', url: '/' });
            breadcrumb.push({ title: decoded?.manufacturer || vin || '', url: '/' });
        } else if (mode === 'moto') {
            const parts = [motoBrand, motoModel, motoYear].filter(Boolean);
            title = parts.length > 0 ? parts.join(' ') : 'Moto';
            subtitle = motoPartType || 'Toutes pièces moto';
            breadcrumb.push({ title: 'Moto', url: url.motoHome() });
            breadcrumb.push({ title: title, url: '/' });
        } else {
            const parts = [vehicleYear, vehicleMake, vehicleModel].filter(Boolean);
            title = parts.length > 0 ? parts.join(' ') : 'Véhicule';
            subtitle = vehicleEngine || 'Toutes pièces';
            breadcrumb.push({ title: 'Recherche véhicule', url: '/' });
            breadcrumb.push({ title: title, url: '/' });
        }

        return { title, subtitle, breadcrumb };
    }, [mode, decoded, vin, vehicleMake, vehicleModel, vehicleYear, vehicleEngine, motoBrand, motoModel, motoYear, motoPartType]);

    // React to shop state changes
    React.useEffect(() => {
        if (!shopState.init) return;

        const query = buildQuery(shopState.options, shopState.filters);
        router.replace({ pathname: router.pathname, query: { ...router.query, ...queryString.parse(query) } }, undefined, { shallow: true }).then();
    }, [shopState.options, shopState.filters]);

    return (
        <React.Fragment>
            <PageTitle>{pageInfo.title}</PageTitle>

            <BlockHeader pageTitle={pageInfo.title} breadcrumb={pageInfo.breadcrumb} />

            {/* Vehicle Info Banner */}
            <div className="vehicle-search-info">
                <div className="container">
                    <div className="vehicle-search-info__inner">
                        {/* Left: Vehicle icon + info */}
                        <div className="vehicle-search-info__left">
                            <div className="vehicle-search-info__icon">
                                {mode === 'moto' ? (
                                    <i className="fas fa-motorcycle" />
                                ) : mode === 'vin' ? (
                                    <i className="fas fa-barcode" />
                                ) : (
                                    <i className="fas fa-car" />
                                )}
                            </div>
                            <div className="vehicle-search-info__details">
                                <h2 className="vehicle-search-info__title">{pageInfo.title}</h2>
                                {pageInfo.subtitle && (
                                    <span className="vehicle-search-info__subtitle">{pageInfo.subtitle}</span>
                                )}
                            </div>
                        </div>

                        {/* Right: Decoded details */}
                        <div className="vehicle-search-info__right">
                            {mode === 'vin' && decoded && decoded.valid && (
                                <div className="vehicle-search-info__tags">
                                    <span className="vehicle-search-info__tag">
                                        <i className="fas fa-industry" />
                                        {decoded.manufacturer}
                                    </span>
                                    <span className="vehicle-search-info__tag">
                                        <i className="fas fa-globe-americas" />
                                        {decoded.country}
                                    </span>
                                    <span className="vehicle-search-info__tag">
                                        <i className="fas fa-calendar-alt" />
                                        {decoded.year}
                                    </span>
                                    <span className="vehicle-search-info__tag">
                                        <i className="fas fa-car-side" />
                                        {decoded.bodyStyle}
                                    </span>
                                    <span className="vehicle-search-info__tag">
                                        <i className="fas fa-gas-pump" />
                                        {decoded.engineType}
                                    </span>
                                    <span className="vehicle-search-info__tag vehicle-search-info__tag--vin">
                                        <i className="fas fa-fingerprint" />
                                        {decoded.serialNumber}
                                    </span>
                                </div>
                            )}

                            {mode === 'vehicle' && (
                                <div className="vehicle-search-info__tags">
                                    {vehicleYear && (
                                        <span className="vehicle-search-info__tag">
                                            <i className="fas fa-calendar-alt" />
                                            {vehicleYear}
                                        </span>
                                    )}
                                    {vehicleMake && (
                                        <span className="vehicle-search-info__tag">
                                            <i className="fas fa-industry" />
                                            {vehicleMake}
                                        </span>
                                    )}
                                    {vehicleModel && (
                                        <span className="vehicle-search-info__tag">
                                            <i className="fas fa-car-side" />
                                            {vehicleModel}
                                        </span>
                                    )}
                                    {vehicleEngine && (
                                        <span className="vehicle-search-info__tag">
                                            <i className="fas fa-cogs" />
                                            {vehicleEngine}
                                        </span>
                                    )}
                                </div>
                            )}

                            {mode === 'moto' && (
                                <div className="vehicle-search-info__tags">
                                    {motoBrand && (
                                        <span className="vehicle-search-info__tag">
                                            <i className="fas fa-industry" />
                                            {motoBrand}
                                        </span>
                                    )}
                                    {motoModel && (
                                        <span className="vehicle-search-info__tag">
                                            <i className="fas fa-motorcycle" />
                                            {motoModel}
                                        </span>
                                    )}
                                    {motoYear && (
                                        <span className="vehicle-search-info__tag">
                                            <i className="fas fa-calendar-alt" />
                                            {motoYear}
                                        </span>
                                    )}
                                    {motoPartType && (
                                        <span className="vehicle-search-info__tag">
                                            <i className="fas fa-tools" />
                                            {motoPartType}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid with Sidebar */}
            <SidebarProvider>
                <CurrentVehicleScopeProvider>
                    <div className="block-split block-split--has-sidebar">
                        <div className="container">
                            <div className="block-split__row row no-gutters">
                                <div className="block-split__item block-split__item-sidebar col-auto">
                                    <ShopSidebar offcanvas="mobile" />
                                </div>
                                <div className="block-split__item block-split__item-content col-auto flex-grow-1">
                                    <div className="block">
                                        <ProductsView
                                            layout="grid"
                                            gridLayout="grid-4-sidebar"
                                            offCanvasSidebar="mobile"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <BlockSpace layout="before-footer" />
                </CurrentVehicleScopeProvider>
            </SidebarProvider>
        </React.Fragment>
    );
}

export default VehicleSearchPage;
