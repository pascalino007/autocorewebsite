// react
import React, { useMemo } from 'react';
// application
import BlockBanners from '~/components/blocks/BlockBanners';
import BlockBrands from '~/components/blocks/BlockBrands';
import BlockFeatures from '~/components/blocks/BlockFeatures';
import BlockFinderMoto from '~/components/blocks/BlockFinderMoto';
import BlockProductsCarousel from '~/components/blocks/BlockProductsCarousel';
import BlockProductsColumns from '~/components/blocks/BlockProductsColumns';
import BlockSale from '~/components/blocks/BlockSale';
import BlockSpace from '~/components/blocks/BlockSpace';
import ProductCard from '~/components/shared/ProductCard';
import { shopApi } from '~/api';
import { useDeferredData, useProductColumns } from '~/services/hooks';

function MotoPage() {
    const promoProducts = useDeferredData(() => shopApi.getSpecialOffers(4), []);
    const topRated = useDeferredData(() => shopApi.getTopRatedProducts(null, 8), []);
    const blockSale = useDeferredData(() => shopApi.getSpecialOffers(8), []);
    const brands = useDeferredData(() => shopApi.getBrands({ limit: 16 }), []);

    const columns = useProductColumns(
        useMemo(() => [
            {
                title: 'Meilleures Ventes Moto',
                source: () => shopApi.getPopularProducts(null, 3),
            },
            {
                title: 'Offres Spéciales',
                source: () => shopApi.getSpecialOffers(3),
            },
            {
                title: 'Les Mieux Notés',
                source: () => shopApi.getTopRatedProducts(null, 3),
            },
        ], []),
    );

    return (
        <React.Fragment>
            <BlockFinderMoto />
            <BlockFeatures layout="top-strip" />
            <BlockSpace layout="divider-nl" />

            {/* Special Promotions — compact cards without supplier/availability/rating clutter */}
            <div className="moto-mini-promo">
                <div className="container">
                    <div className="moto-mini-promo__head">
                        <h2 className="moto-mini-promo__title">Promotions Spéciales</h2>
                        <span className="moto-mini-promo__subtitle">Offres limitées sur les pièces moto</span>
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

            <BlockProductsCarousel
                blockTitle="Les Mieux Notés"
                layout="grid-5"
                loading={topRated.isLoading}
                products={topRated.data}
            />

            <BlockSpace layout="divider-nl" />

            <BlockSale
                products={blockSale.data}
                loading={blockSale.isLoading}
            />

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

export default MotoPage;
