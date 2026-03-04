// react
import React, { useMemo } from 'react';
// application
import BlockBanners from '~/components/blocks/BlockBanners';
import BlockBrands from '~/components/blocks/BlockBrands';
import BlockFeatures from '~/components/blocks/BlockFeatures';
import BlockFinderTruck from '~/components/blocks/BlockFinderTruck';
import BlockProductsCarousel from '~/components/blocks/BlockProductsCarousel';
import BlockProductsColumns from '~/components/blocks/BlockProductsColumns';
import BlockSale from '~/components/blocks/BlockSale';
import BlockSpace from '~/components/blocks/BlockSpace';
import ProductCard from '~/components/shared/ProductCard';
import { shopApi } from '~/api';
import { useDeferredData, useProductColumns } from '~/services/hooks';
import url from '~/services/url';

// Camions page uses TRUCK vehicle type for proper filtering
function CamionsPage() {
    const promoProducts = useDeferredData(
        () => shopApi.getProductsList({ limit: 4 }, { isFeatured: 'true', vehicleType: 'TRUCK' }).then((r) => r.items),
        [],
    );
    const topRated = useDeferredData(() => shopApi.getTopRatedProducts(null, 8, 'TRUCK'), []);
    const blockSale = useDeferredData(
        () => shopApi.getProductsList({ limit: 8 }, { isFeatured: 'true', vehicleType: 'TRUCK' }).then((r) => r.items),
        [],
    );
    const brands = useDeferredData(() => shopApi.getBrands({ limit: 16 }), []);

    // Themed product sections: oils, filters, engines, tires, brakes, batteries
    const oils = useDeferredData(
        () => shopApi.getProductsList({ limit: 8 }, { search: 'huile', vehicleType: 'TRUCK' }),
        [],
    );
    const filters = useDeferredData(
        () => shopApi.getProductsList({ limit: 8 }, { search: 'filtre', vehicleType: 'TRUCK' }),
        [],
    );
    const engines = useDeferredData(
        () => shopApi.getProductsList({ limit: 8 }, { search: 'moteur', vehicleType: 'TRUCK' }),
        [],
    );
    const tires = useDeferredData(
        () => shopApi.getProductsList({ limit: 8 }, { search: 'pneu', vehicleType: 'TRUCK' }),
        [],
    );
    const brakes = useDeferredData(
        () => shopApi.getProductsList({ limit: 8 }, { search: 'frein', vehicleType: 'TRUCK' }),
        [],
    );
    const batteries = useDeferredData(
        () => shopApi.getProductsList({ limit: 8 }, { search: 'batterie', vehicleType: 'TRUCK' }),
        [],
    );

    const columns = useProductColumns(
        useMemo(() => [
            {
                title: 'Meilleures Ventes Camions',
                source: () => shopApi.getPopularProducts(null, 3, 'TRUCK'),
            },
            {
                title: 'Offres Spéciales',
                source: () => shopApi.getSpecialOffers(3, 'TRUCK'),
            },
            {
                title: 'Les Mieux Notés',
                source: () => shopApi.getTopRatedProducts(null, 3, 'TRUCK'),
            },
        ], []),
    );

    return (
        <React.Fragment>
            <BlockFinderTruck />
            <BlockFeatures layout="top-strip" />
            <BlockSpace layout="divider-nl" />

            {/* Promo strip */}
            <div className="moto-mini-promo">
                <div className="container">
                    <div className="moto-mini-promo__head">
                        <h2 className="moto-mini-promo__title">Promotions Poids Lourd</h2>
                        <span className="moto-mini-promo__subtitle">Offres sur pièces camions &amp; bus</span>
                    </div>
                    <div className="moto-mini-promo__grid">
                        {promoProducts.data.slice(0, 4).map((product) => (
                            <div key={product.id} className="moto-mini-promo__item">
                                <span className="moto-mini-promo__badge">Promo</span>
                                <ProductCard
                                    product={product}
                                    exclude={['supplier', 'availability', 'rating', 'meta', 'features']}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <BlockSpace layout="divider-nl" />

            {/* Feature grid */}
            <section className="moto-feature-grid">
                <div className="container">
                    <div className="moto-feature-grid__head">
                        <h2 className="moto-feature-grid__title">Pourquoi acheter vos pièces camions sur Akodessewa ?</h2>
                        <p className="moto-feature-grid__subtitle">
                            Pièces poids lourd, livraison dédiée et support professionnel pour flottes et transporteurs.
                        </p>
                    </div>
                    <div className="moto-feature-grid__items">
                        <div className="moto-feature-grid__item">
                            <h3 className="moto-feature-grid__item-title">Spécialistes Poids Lourd</h3>
                            <p className="moto-feature-grid__item-text">
                                Catalogue adapté aux camions, bus et véhicules industriels avec pièces d&apos;origine et équivalents.
                            </p>
                        </div>
                        <div className="moto-feature-grid__item">
                            <h3 className="moto-feature-grid__item-title">Livraison Flotte</h3>
                            <p className="moto-feature-grid__item-text">
                                Solutions logistiques pour professionnels : commandes groupées, livraison sur site ou atelier.
                            </p>
                        </div>
                        <div className="moto-feature-grid__item">
                            <h3 className="moto-feature-grid__item-title">Support Pro</h3>
                            <p className="moto-feature-grid__item-text">
                                Équipe dédiée pour les achats B2B et la mise en relation avec des ateliers agréés.
                            </p>
                        </div>
                        <div className="moto-feature-grid__item">
                            <h3 className="moto-feature-grid__item-title">Qualité &amp; Garantie</h3>
                            <p className="moto-feature-grid__item-text">
                                Pièces certifiées pour une utilisation intensive et une traçabilité complète.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <BlockSpace layout="divider-nl" />

            <BlockProductsCarousel
                blockTitle="Les Mieux Notés"
                layout="grid-5"
                loading={topRated.isLoading}
                products={topRated.data}
            />

            <BlockSpace layout="divider-nl" />

            {/* Huiles & Lubrifiants */}
            <BlockProductsCarousel
                blockTitle="Huiles &amp; Lubrifiants Poids Lourd"
                layout="grid-4"
                loading={oils.isLoading}
                products={oils.data?.items || []}
            />

            <section className="moto-inline-ad">
                <div className="container moto-inline-ad__container">
                    <div className="moto-inline-ad__label">Espace Publicitaire</div>
                    <div className="moto-inline-ad__content">
                        <span className="moto-inline-ad__title">Visibilité auprès des transporteurs et flottes</span>
                        <span className="moto-inline-ad__text">
                            Placez ici vos offres de lubrifiants, fluides ou services pour poids lourd.
                        </span>
                    </div>
                </div>
            </section>

            {/* Filtres */}
            <BlockProductsCarousel
                blockTitle="Filtres (Air, Huile, Carburant)"
                layout="grid-4"
                loading={filters.isLoading}
                products={filters.data?.items || []}
            />

            <section className="moto-inline-ad moto-inline-ad--dark">
                <div className="container moto-inline-ad__container">
                    <div className="moto-inline-ad__label">Espace Pub Filtres</div>
                    <div className="moto-inline-ad__content">
                        <span className="moto-inline-ad__title">Marques de filtres pour camions et bus</span>
                        <span className="moto-inline-ad__text">
                            Idéal pour fabricants et distributeurs de filtres industriels.
                        </span>
                    </div>
                </div>
            </section>

            {/* Moteurs */}
            <BlockProductsCarousel
                blockTitle="Moteurs &amp; Pièces Moteur"
                layout="grid-4"
                loading={engines.isLoading}
                products={engines.data?.items || []}
            />

            <section className="moto-inline-ad">
                <div className="container moto-inline-ad__container">
                    <div className="moto-inline-ad__label">Espace Pub Atelier</div>
                    <div className="moto-inline-ad__content">
                        <span className="moto-inline-ad__title">Ateliers poids lourd : faites-vous connaître</span>
                        <span className="moto-inline-ad__text">
                            Un emplacement premium pour les réparateurs et mainteneurs de flottes.
                        </span>
                    </div>
                </div>
            </section>

            {/* Pneus */}
            <BlockProductsCarousel
                blockTitle="Pneus &amp; Roues"
                layout="grid-4"
                loading={tires.isLoading}
                products={tires.data?.items || []}
            />

            <section className="moto-inline-ad moto-inline-ad--accent">
                <div className="container moto-inline-ad__container">
                    <div className="moto-inline-ad__label">Espace Pub Pneus</div>
                    <div className="moto-inline-ad__content">
                        <span className="moto-inline-ad__title">Pneus camion, bus et véhicules industriels</span>
                        <span className="moto-inline-ad__text">
                            Mettez en avant vos gammes poids lourd auprès des transporteurs.
                        </span>
                    </div>
                </div>
            </section>

            {/* Freins */}
            <BlockProductsCarousel
                blockTitle="Freins &amp; Plaquettes"
                layout="grid-4"
                loading={brakes.isLoading}
                products={brakes.data?.items || []}
            />

            <section className="moto-inline-ad">
                <div className="container moto-inline-ad__container">
                    <div className="moto-inline-ad__label">Espace Pub Freinage</div>
                    <div className="moto-inline-ad__content">
                        <span className="moto-inline-ad__title">Systèmes de freinage pour poids lourd</span>
                        <span className="moto-inline-ad__text">
                            Fabricants et distributeurs de pièces freinage professionnel.
                        </span>
                    </div>
                </div>
            </section>

            {/* Batteries & Électricité */}
            <BlockProductsCarousel
                blockTitle="Électricité &amp; Batteries"
                layout="grid-4"
                loading={batteries.isLoading}
                products={batteries.data?.items || []}
            />

            <BlockSpace layout="divider-nl" />

            {/* Hero ad banner */}
            <section className="moto-hero-ad">
                <div className="container moto-hero-ad__container">
                    <div className="moto-hero-ad__content">
                        <h2 className="moto-hero-ad__title">Entretien et pièces pour votre flotte</h2>
                        <p className="moto-hero-ad__text">
                            Huiles moteur, filtres, plaquettes de frein, pneus et pièces d&apos;usure pour camions et bus.
                        </p>
                        <ul className="moto-hero-ad__list">
                            <li>Vidanges et kits entretien</li>
                            <li>Pneus toutes positions</li>
                            <li>Freinage &amp; suspension</li>
                        </ul>
                        <a href={url.camionsParts()} className="btn btn-primary moto-hero-ad__btn">
                            Voir le catalogue poids lourd
                        </a>
                    </div>
                    <div className="moto-hero-ad__visual">
                        <div className="moto-hero-ad__tag">Espace Pub</div>
                        <div className="moto-hero-ad__placeholder">
                            Visuel campagne camions
                        </div>
                    </div>
                </div>
            </section>

            <BlockSpace layout="divider-nl" />

            {/* Partner ad tiles */}
            <section className="moto-partner-ads">
                <div className="container">
                    <div className="moto-partner-ads__grid">
                        <div className="moto-partner-ads__card moto-partner-ads__card--garage">
                            <div className="moto-partner-ads__label">Espace Pub Atelier</div>
                            <h3 className="moto-partner-ads__title">Vous réparez des camions ou bus ?</h3>
                            <p className="moto-partner-ads__text">
                                Référencez votre atelier auprès des transporteurs qui achètent leurs pièces sur Akodessewa.
                            </p>
                            <a href={url.pageContactUs()} className="btn btn-light moto-partner-ads__btn">
                                Devenir partenaire
                            </a>
                        </div>
                        <div className="moto-partner-ads__card moto-partner-ads__card--insurance">
                            <div className="moto-partner-ads__label">Espace Pub Assurance / Flotte</div>
                            <h3 className="moto-partner-ads__title">Assurance flotte &amp; poids lourd</h3>
                            <p className="moto-partner-ads__text">
                                Proposez vos offres d&apos;assurance camion et flotte sur la page dédiée aux professionnels.
                            </p>
                            <a href={url.pageContactUs()} className="btn btn-outline-light moto-partner-ads__btn">
                                Nous contacter
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <BlockSpace layout="divider-nl" />

            <BlockSale products={blockSale.data} loading={blockSale.isLoading} />

            <BlockSpace layout="divider-nl" />
            <BlockBanners />
            <BlockSpace layout="divider-nl" />
            <BlockBrands layout="columns-8-full" brands={brands.data} />
            <BlockSpace layout="divider-nl" className="d-xl-block d-none" />
            <BlockProductsColumns columns={columns} />
            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default CamionsPage;
