// react
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// third-party
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
// application
import AppImage from '~/components/shared/AppImage';
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import ProductsView from '~/components/shop/ProductsView';
import ShopSidebar from '~/components/shop/ShopSidebar';
import url from '~/services/url';
import { brands } from '~/fake-server/database/brands';
import { buildQuery, parseQueryFilters, parseQueryOptions } from '~/store/shop/shopHelpers';
import { CurrentVehicleScopeProvider } from '~/services/current-vehicle';
import { IBrand } from '~/interfaces/brand';
import { ILink } from '~/interfaces/link';
import { COUNTRY_COORDS } from '~/services/userLocation';
import { SidebarProvider } from '~/services/sidebar';
import { shopInitThunk } from '~/store/shop/shopActions';
import { useShop } from '~/store/shop/shopHooks';
import { wrapper } from '~/store/store';
import { AppDispatch } from '~/store/types';
import queryString from 'query-string';
import PageTitle from '~/components/shared/PageTitle';

interface Props {
    brand: IBrand | null;
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context: GetServerSidePropsContext) => {
    const slug = typeof context.params?.slug === 'string' ? context.params.slug : '';
    const brand = brands.find((b) => b.slug === slug) || null;

    if (!brand) {
        return { notFound: true };
    }

    // Initialize shop with brand filter pre-applied
    if (typeof context.req.url === 'string') {
        const query = queryString.stringify(queryString.parseUrl(context.req.url).query);
        const options = parseQueryOptions(query);
        const filters = parseQueryFilters(query);

        // Force the brand filter
        filters.brand = brand.slug;

        const dispatch = store.dispatch as AppDispatch;
        await dispatch(shopInitThunk(null, options, filters));
    }

    return {
        props: {
            brand,
        },
    };
});

function SupplierPage({ brand }: Props) {
    const intl = useIntl();
    const router = useRouter();
    const shopState = useShop();
    const [vinInput, setVinInput] = useState('');

    // Resolve country name
    const countryName = useMemo(() => {
        if (!brand) return '';
        const coords = COUNTRY_COORDS[brand.country];
        return coords ? coords.name : brand.country;
    }, [brand]);

    // Stats (simulated)
    const stats = useMemo(() => ({
        products: shopState.productsList?.items?.length || 0,
        rating: 4.7,
        reviews: 238,
        responseTime: '< 2h',
        since: '2020',
    }), [shopState.productsList]);

    useEffect(() => {
        if (!shopState.init) {
            return;
        }

        const query = buildQuery(shopState.options, shopState.filters, { slug: router.query.slug });
        router.replace({ pathname: router.pathname, query }, undefined, { shallow: true }).then();
    }, [shopState.options, shopState.filters]);

    const handleVinSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!vinInput.trim() || !brand) return;

        // Navigate to products filtered by brand + VIN as a search query
        router.push({
            pathname: '/catalog/products',
            query: {
                filter_brand: brand.slug,
                vin: vinInput.trim(),
            },
        }).then();
    }, [vinInput, brand, router]);

    if (!brand) {
        return null;
    }

    const breadcrumb: ILink[] = [
        { title: intl.formatMessage({ id: 'LINK_HOME' }), url: url.home() },
        { title: 'Fournisseurs', url: url.shop() },
        { title: brand.name, url: url.brand(brand) },
    ];

    return (
        <React.Fragment>
            <PageTitle>{`${brand.name} - Fournisseur`}</PageTitle>

            <BlockHeader pageTitle={brand.name} breadcrumb={breadcrumb} />

            {/* Supplier Profile Banner */}
            <div className="supplier-profile">
                <div className="container">
                    <div className="supplier-profile__inner">
                        {/* Left: Supplier Info */}
                        <div className="supplier-profile__left">
                            <div className="supplier-profile__avatar">
                                {brand.image ? (
                                    <AppImage src={brand.image} />
                                ) : (
                                    <span className="supplier-profile__avatar-initial">
                                        {brand.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <div className="supplier-profile__details">
                                <h2 className="supplier-profile__name">{brand.name}</h2>
                                <div className="supplier-profile__location">
                                    <i className="fas fa-map-marker-alt" />
                                    <span>{countryName}</span>
                                </div>
                                <div className="supplier-profile__badges">
                                    <span className="supplier-profile__badge supplier-profile__badge--trusted">
                                        <i className="fas fa-check-circle" />
                                        Trusted Supplier
                                    </span>
                                    <span className="supplier-profile__badge supplier-profile__badge--recommended">
                                        <i className="fas fa-thumbs-up" />
                                        Recommandé
                                    </span>
                                    <span className="supplier-profile__badge supplier-profile__badge--verified">
                                        <i className="fas fa-shield-alt" />
                                        Vérifié
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Stats */}
                        <div className="supplier-profile__right">
                            <div className="supplier-profile__stats">
                                <div className="supplier-profile__stat">
                                    <i className="fas fa-box" />
                                    <div className="supplier-profile__stat-content">
                                        <span className="supplier-profile__stat-value">{stats.products}+</span>
                                        <span className="supplier-profile__stat-label">Produits</span>
                                    </div>
                                </div>
                                <div className="supplier-profile__stat">
                                    <i className="fas fa-star" />
                                    <div className="supplier-profile__stat-content">
                                        <span className="supplier-profile__stat-value">{stats.rating}/5</span>
                                        <span className="supplier-profile__stat-label">{stats.reviews} avis</span>
                                    </div>
                                </div>
                                <div className="supplier-profile__stat">
                                    <i className="fas fa-clock" />
                                    <div className="supplier-profile__stat-content">
                                        <span className="supplier-profile__stat-value">{stats.responseTime}</span>
                                        <span className="supplier-profile__stat-label">Réponse</span>
                                    </div>
                                </div>
                                <div className="supplier-profile__stat">
                                    <i className="fas fa-calendar-alt" />
                                    <div className="supplier-profile__stat-content">
                                        <span className="supplier-profile__stat-value">Depuis {stats.since}</span>
                                        <span className="supplier-profile__stat-label">Membre</span>
                                    </div>
                                </div>
                            </div>

                            <div className="supplier-profile__actions">
                                <a
                                    href="https://wa.me/0022890171212"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="supplier-profile__action supplier-profile__action--whatsapp"
                                >
                                    <i className="fab fa-whatsapp" />
                                    Contacter
                                </a>
                                <button
                                    type="button"
                                    className="supplier-profile__action supplier-profile__action--follow"
                                >
                                    <i className="fas fa-heart" />
                                    Suivre
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trust highlights */}
                    <div className="supplier-profile__highlights">
                        <div className="supplier-profile__highlight">
                            <i className="fas fa-shipping-fast" />
                            <span>Livraison rapide</span>
                        </div>
                        <div className="supplier-profile__highlight">
                            <i className="fas fa-undo" />
                            <span>Retours gratuits</span>
                        </div>
                        <div className="supplier-profile__highlight">
                            <i className="fas fa-headset" />
                            <span>Support 24/7</span>
                        </div>
                        <div className="supplier-profile__highlight">
                            <i className="fas fa-shield-alt" />
                            <span>Paiement sécurisé</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ad Banner */}
            <div className="supplier-banner">
                <div className="container">
                    <div className="supplier-banner__inner">
                        <div className="supplier-banner__content">
                            <div className="supplier-banner__icon">
                                <i className="fas fa-bullhorn" />
                            </div>
                            <div className="supplier-banner__text">
                                <h4 className="supplier-banner__title">
                                    Pièces {brand.name} en promotion
                                </h4>
                                <p className="supplier-banner__subtitle">
                                    Profitez de remises exclusives sur toute la gamme de pièces détachées {brand.name}.
                                    Livraison rapide et garantie constructeur.
                                </p>
                            </div>
                        </div>
                        <div className="supplier-banner__cta">
                            <a
                                href="https://wa.me/0022890171212"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="supplier-banner__btn"
                            >
                                <i className="fab fa-whatsapp" />
                                Commander maintenant
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* VIN Search Bar */}
            <div className="supplier-vin">
                <div className="container">
                    <div className="supplier-vin__inner">
                        <div className="supplier-vin__info">
                            <i className="fas fa-car" />
                            <div>
                                <strong>Recherche par VIN</strong>
                                <span>Entrez le numéro de châssis de votre véhicule pour trouver les pièces compatibles</span>
                            </div>
                        </div>
                        <form className="supplier-vin__form" onSubmit={handleVinSearch}>
                            <input
                                type="text"
                                className="supplier-vin__input"
                                placeholder="Ex: WBA3B1C55FK123456"
                                value={vinInput}
                                onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                                maxLength={17}
                            />
                            <button type="submit" className="supplier-vin__btn">
                                <i className="fas fa-search" />
                                Rechercher
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Products Grid with Sidebar Filters */}
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

export default SupplierPage;
