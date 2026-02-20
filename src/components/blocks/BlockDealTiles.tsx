// react
import React from 'react';
// application
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

interface DealTile {
    title: string;
    subtitle: string;
    icon: string;
    cta: string;
    href: string;
    theme: 'red-dark' | 'red-medium' | 'red-light' | 'red-accent';
}

const tiles: DealTile[] = [
    {
        title: 'Livraison le Meme Jour',
        subtitle: 'Economisez 20% sur la livraison',
        icon: 'fas fa-shipping-fast',
        cta: 'Voir les offres',
        href: '/promotions/same-day-delivery',
        theme: 'red-dark',
    },
    {
        title: 'Ventes Tendances',
        subtitle: 'Les favoris pour chaque trajet',
        icon: 'fas fa-fire',
        cta: 'Voir les offres',
        href: '/promotions/trending-sale',
        theme: 'red-medium',
    },
    {
        title: 'Livraison Gratuite',
        subtitle: "Jusqu'a 25% de reduction",
        icon: 'fas fa-truck',
        cta: 'Voir les offres',
        href: '/promotions/free-shipping',
        theme: 'red-light',
    },
    {
        title: 'Offres Speciales',
        subtitle: 'Promotions sur pneus & services',
        icon: 'fas fa-tags',
        cta: 'Voir les offres',
        href: '/promotions/special-offers',
        theme: 'red-accent',
    },
];

function BlockDealTiles() {
    return (
        <div className="block block-deal-tiles">
            <div className="container">
                <div className="block-deal-tiles__banner">
                    <div className="block-deal-tiles__banner-text">
                        <div className="block-deal-tiles__banner-title">
                            Les offres membres sont arrivees.
                        </div>
                        <div className="block-deal-tiles__banner-subtitle">
                            Des economies instantanees chaque semaine.
                        </div>
                    </div>
                    <AppLink href={url.products()} className="btn btn-primary btn-sm">
                        Voir la boutique
                    </AppLink>
                </div>
                <div className="block-deal-tiles__grid">
                    {tiles.map((tile) => (
                        <AppLink
                            key={tile.title}
                            href={tile.href}
                            className={`block-deal-tiles__card block-deal-tiles__card--${tile.theme}`}
                        >
                            <div className="block-deal-tiles__card-icon">
                                <i className={tile.icon} />
                            </div>
                            <div className="block-deal-tiles__card-text">
                                <div className="block-deal-tiles__card-title">{tile.title}</div>
                                <div className="block-deal-tiles__card-subtitle">{tile.subtitle}</div>
                                <span className="block-deal-tiles__card-cta">
                                    {tile.cta} <i className="fas fa-arrow-right" />
                                </span>
                            </div>
                        </AppLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockDealTiles);
