// react
import React, { useMemo } from 'react';
// third-party
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
// application
import BlockSpace from '~/components/blocks/BlockSpace';
import BlockProductsCarousel from '~/components/blocks/BlockProductsCarousel';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';
import { shopApi } from '~/api';
import { useDeferredData, useProductTabs } from '~/services/hooks';

interface PromoInfo {
    title: string;
    subtitle: string;
    icon: string;
    description: string;
    gradient: string;
}

const promoMap: Record<string, PromoInfo> = {
    'same-day-delivery': {
        title: 'Livraison le Meme Jour',
        subtitle: 'Economisez 20% sur la livraison express',
        icon: 'fas fa-shipping-fast',
        description: 'Profitez de la livraison le meme jour sur une selection de pieces auto et moto. Commandez avant 14h et recevez vos pieces chez vous ou a votre garage le jour meme.',
        gradient: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
    },
    'trending-sale': {
        title: 'Ventes Tendances',
        subtitle: 'Les favoris pour chaque trajet',
        icon: 'fas fa-fire',
        description: 'Decouvrez les pieces les plus populaires du moment. Des filtres a huile aux plaquettes de frein, retrouvez les produits les mieux notes par notre communaute.',
        gradient: 'linear-gradient(135deg, #c62828 0%, #880e4f 100%)',
    },
    'free-shipping': {
        title: 'Livraison Gratuite',
        subtitle: "Jusqu'a 25% de reduction + livraison offerte",
        icon: 'fas fa-truck',
        description: 'Livraison gratuite sur une large selection de produits. Pas de minimum de commande requis. Offre valable pour les livraisons en zone urbaine.',
        gradient: 'linear-gradient(135deg, #d32f2f 0%, #e53935 100%)',
    },
    'special-offers': {
        title: 'Offres Speciales',
        subtitle: 'Promotions exclusives sur pneus & services',
        icon: 'fas fa-tags',
        description: 'Offres limitees sur les pneus, batteries, amortisseurs et bien plus. Profitez de nos promotions exclusives reservees aux membres Akodessewa.',
        gradient: 'linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)',
    },
};

function PromotionPage() {
    const router = useRouter();
    const { slug } = router.query;
    const intl = useIntl();

    const promo = promoMap[slug as string] || promoMap['special-offers'];

    const featuredProducts = useProductTabs(
        useMemo(() => [
            { id: 1, name: 'Tous', categorySlug: null },
            { id: 2, name: 'Moteur', categorySlug: 'power-tools' },
            { id: 3, name: 'Freinage', categorySlug: 'hand-tools' },
            { id: 4, name: 'Pneus', categorySlug: 'plumbing' },
        ], []),
        (tab) => shopApi.getFeaturedProducts(tab.categorySlug, 12),
    );

    const specialOffers = useDeferredData(() => shopApi.getSpecialOffers(8), []);

    return (
        <React.Fragment>
            <Head>
                <title>{promo.title} — Promotions — Akodessewa.com</title>
            </Head>

            <div className="promo-page">
                {/* Hero Banner */}
                <div className="promo-page__hero" style={{ background: promo.gradient }}>
                    <div className="container">
                        <div className="promo-page__hero-content">
                            <div className="promo-page__hero-icon">
                                <i className={promo.icon} />
                            </div>
                            <h1 className="promo-page__hero-title">{promo.title}</h1>
                            <p className="promo-page__hero-subtitle">{promo.subtitle}</p>
                            <p className="promo-page__hero-desc">{promo.description}</p>
                        </div>
                    </div>
                </div>

                <div className="container">
                    {/* Breadcrumb */}
                    <div className="promo-page__breadcrumb">
                        <AppLink href={url.home()}>Accueil</AppLink>
                        <i className="fas fa-chevron-right" />
                        <span>Promotions</span>
                        <i className="fas fa-chevron-right" />
                        <span>{promo.title}</span>
                    </div>
                </div>

                <BlockSpace layout="divider-nl" />

                <BlockProductsCarousel
                    blockTitle={`${promo.title} — Produits en promotion`}
                    layout="grid-5"
                    loading={featuredProducts.isLoading}
                    products={featuredProducts.data}
                    groups={featuredProducts.tabs}
                    currentGroup={featuredProducts.tabs.find((x) => x.current)}
                    onChangeGroup={featuredProducts.handleTabChange}
                />

                <BlockSpace layout="divider-nl" />

                <BlockProductsCarousel
                    blockTitle="Offres Speciales"
                    layout="horizontal"
                    rows={2}
                    loading={specialOffers.isLoading}
                    products={specialOffers.data}
                />

                <BlockSpace layout="divider-nl" />

                {/* Other promo links */}
                <div className="container">
                    <div className="promo-page__other-promos">
                        <h3>Autres promotions</h3>
                        <div className="promo-page__other-grid">
                            {Object.entries(promoMap)
                                .filter(([key]) => key !== slug)
                                .map(([key, p]) => (
                                    <AppLink key={key} href={`/promotions/${key}`} className="promo-page__other-card" style={{ background: p.gradient }}>
                                        <i className={p.icon} />
                                        <span>{p.title}</span>
                                        <i className="fas fa-arrow-right" />
                                    </AppLink>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default PromotionPage;
