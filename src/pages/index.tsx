// react
import React, { useMemo } from 'react';
// third-party
import { useIntl } from 'react-intl';
// application
import BlockBanners from '~/components/blocks/BlockBanners';
import BlockCategoryIcons from '~/components/blocks/BlockCategoryIcons';
import BlockDealTiles from '~/components/blocks/BlockDealTiles';
import BlockBrands from '~/components/blocks/BlockBrands';
import BlockFeaturedManufacturers from '~/components/blocks/BlockFeaturedManufacturers';
import BlockFeatures from '~/components/blocks/BlockFeatures';
import BlockFinder from '~/components/blocks/BlockFinder';
import BlockPosts from '~/components/blocks/BlockPosts';
import BlockProductsCarousel from '~/components/blocks/BlockProductsCarousel';
import BlockProductsColumns from '~/components/blocks/BlockProductsColumns';
import BlockPromoDuo from '~/components/blocks/BlockPromoDuo';
import BlockSale from '~/components/blocks/BlockSale';
import BlockSpace from '~/components/blocks/BlockSpace';
import BlockHomeSections from '~/components/blocks/BlockHomeSections';
import BlockUsedVehicles from '~/components/blocks/BlockUsedVehicles';
import BlockUsedVehiclesBanner from '~/components/blocks/BlockUsedVehiclesBanner';
import BlockZone from '~/components/blocks/BlockZone';
import url from '~/services/url';
import { shopApi, blogApi } from '~/api';
import usedVehicles from '~/data/usedVehicles';
import { useDeferredData, useProductColumns, useProductTabs } from '~/services/hooks';
import { getCategoryFallbacks } from '~/services/categoryFallbacks';

function Page() {
    const intl = useIntl();

    /**
     * Featured products with category fallbacks.
     */
    const featuredProducts = useProductTabs(
        useMemo(() => [
            { id: 1, name: 'All', categorySlug: null },
            { id: 2, name: 'Engine Parts', categorySlug: 'engine-parts', fallbacks: getCategoryFallbacks('engine-parts') },
            { id: 3, name: 'Brakes & Suspension', categorySlug: 'brakes-suspension', fallbacks: getCategoryFallbacks('brakes-suspension') },
            { id: 4, name: 'Electrical', categorySlug: 'electrical', fallbacks: getCategoryFallbacks('electrical') },
        ], []),
        async (tab) => {
            try {
                return await shopApi.getFeaturedProducts(tab.categorySlug, 8);
            } catch (error) {
                // Try fallback categories if primary fails
                if (tab.fallbacks && tab.fallbacks.length > 0) {
                    for (const fallbackSlug of tab.fallbacks) {
                        try {
                            return await shopApi.getFeaturedProducts(fallbackSlug, 8);
                        } catch (fallbackError) {
                            console.warn(`Fallback category ${fallbackSlug} also failed:`, fallbackError);
                            continue;
                        }
                    }
                }
                // If all fallbacks fail, return empty array
                console.warn(`All categories failed for tab ${tab.name}, returning empty products`);
                return [];
            }
        },
    );

    const blockSale = useDeferredData(async () => {
        try {
            return await shopApi.getSpecialOffers(8);
        } catch (error) {
            console.warn('Failed to fetch special offers:', error);
            return [];
        }
    }, []);

    const blockZones = useMemo(() => [
        {
            image: '/images/categories/category-overlay-1.jpg',
            mobileImage: '/images/categories/category-overlay-1-mobile.jpg',
            categorySlug: 'tires-wheels',
        },
        {
            image: '/images/categories/category-overlay-2.jpg',
            mobileImage: '/images/categories/category-overlay-2-mobile.jpg',
            categorySlug: 'moto-parts',
        },
        {
            image: '/images/categories/category-overlay-3.jpg',
            mobileImage: '/images/categories/category-overlay-3-mobile.jpg',
            categorySlug: 'engine-drivetrain',
        },
    ], []);

    const newArrivals = useDeferredData(async () => {
        try {
            return await shopApi.getLatestProducts(12);
        } catch (error) {
            console.warn('Failed to fetch latest products:', error);
            return [];
        }
    }, []);
    const newArrivalsLinks = useMemo(() => [
        { title: 'Moto Parts', url: url.motoParts() },
        { title: 'Used Cars', url: url.usedCars() },
        { title: 'Used Motorcycles', url: url.usedMoto() },
        { title: 'Show All', url: url.products() },
    ], []);

    const latestPosts = useDeferredData(async () => {
        try {
            return await blogApi.getLatestPosts(8);
        } catch (error) {
            console.warn('Failed to fetch latest posts:', error);
            return [];
        }
    }, []);
    const latestPostsLinks = useMemo(() => [
        { title: 'Special Offers', url: url.blog() },
        { title: 'New Arrivals', url: url.blog() },
        { title: 'Reviews', url: url.blog() },
    ], []);

    const brands = useDeferredData(async () => {
        try {
            return await shopApi.getBrands({ limit: 16 });
        } catch (error) {
            console.warn('Failed to fetch brands:', error);
            return [];
        }
    }, []);

    /**
     * Product columns with error handling.
     */
    const columns = useProductColumns(
        useMemo(() => [
            {
                title: 'Top Rated Products',
                source: async () => {
                    try {
                        return await shopApi.getTopRatedProducts(null, 3);
                    } catch (error) {
                        console.warn('Failed to fetch top rated products:', error);
                        return [];
                    }
                },
            },
            {
                title: 'Special Offers',
                source: async () => {
                    try {
                        return await shopApi.getSpecialOffers(3);
                    } catch (error) {
                        console.warn('Failed to fetch special offers for columns:', error);
                        return [];
                    }
                },
            },
            {
                title: 'Bestsellers',
                source: async () => {
                    try {
                        return await shopApi.getPopularProducts(null, 3);
                    } catch (error) {
                        console.warn('Failed to fetch popular products for columns:', error);
                        return [];
                    }
                },
            },
        ], []),
    );

    return (
        <React.Fragment>
            <BlockFinder />
            <BlockFeatures layout="top-strip" />
            <BlockSpace layout="divider-nl" />

            <BlockProductsCarousel
                blockTitle={intl.formatMessage({ id: 'HEADER_FEATURED_PRODUCTS' })}
                layout="grid-5"
                loading={featuredProducts.isLoading}
                products={featuredProducts.data}
                groups={featuredProducts.tabs}
                currentGroup={featuredProducts.tabs.find((x) => x.current)}
                onChangeGroup={featuredProducts.handleTabChange}
            />
            <BlockSpace layout="divider-nl" />
            <BlockFeaturedManufacturers />
            <BlockSpace layout="divider-nl" />
            <BlockSale
                products={blockSale.data}
                loading={blockSale.isLoading}
            />

            <BlockSpace layout="divider-lg" />

            {blockZones.map((blockZone, blockZoneIdx) => (
                <React.Fragment key={blockZoneIdx}>
                    <BlockZone
                        image={blockZone.image}
                        mobileImage={blockZone.mobileImage}
                        categorySlug={blockZone.categorySlug}
                    />
                    {blockZoneIdx < blockZones.length - 1 && (
                        <BlockSpace layout="divider-sm" />
                    )}
                </React.Fragment>
            ))}

            <BlockSpace layout="divider-nl" />
            <BlockBanners />
            <BlockSpace layout="divider-nl" />
            <BlockDealTiles />
            <BlockSpace layout="divider-nl" />
            <BlockCategoryIcons />
            <BlockSpace layout="divider-nl" />
            <BlockPromoDuo />
            <BlockSpace layout="divider-nl" />
            <BlockUsedVehiclesBanner />
            <BlockSpace layout="divider-nl" />
            <BlockUsedVehicles
                title="Véhicules d'occasion"
                vehicles={usedVehicles.slice(0, 8)}
                viewAllHref={url.usedVehicles()}
            />
            <BlockSpace layout="divider-nl" />
            <BlockHomeSections 
                showGaragePartners={true}
                showAccessories={true}
                showMechanicalTools={true}
                accessoriesCategorySlug="accessoires"
                toolsCategorySlug="outils-mecanique"
            />
            <BlockSpace layout="divider-nl" />
            <BlockProductsCarousel
                blockTitle={intl.formatMessage({ id: 'HEADER_NEW_ARRIVALS' })}
                layout="horizontal"
                rows={2}
                loading={newArrivals.isLoading}
                products={newArrivals.data}
                links={newArrivalsLinks}
            />
            <BlockSpace layout="divider-nl" />
            <BlockPosts
                blockTitle={intl.formatMessage({ id: 'HEADER_LATEST_NEWS' })}
                layout="grid"
                loading={latestPosts.isLoading}
                posts={latestPosts.data}
                links={latestPostsLinks}
            />
            <BlockSpace layout="divider-nl" />
            <BlockBrands
                layout="columns-8-full"
                brands={brands.data}
            />
            <BlockSpace layout="divider-nl" className="d-xl-block d-none" />
            <BlockProductsColumns columns={columns} />
            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
