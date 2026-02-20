// react
import React, { useMemo, useState } from 'react';
// third-party
import Head from 'next/head';
// application
import BlockSpace from '~/components/blocks/BlockSpace';
import GarageCard from '~/components/shared/GarageCard';
import AppLink from '~/components/shared/AppLink';
import garages, { IGarage } from '~/data/garages';

type FilterType = 'all' | 'vip' | 'normal';

function GaragesPage() {
    const [filter, setFilter] = useState<FilterType>('all');
    const [search, setSearch] = useState('');

    const filteredGarages = useMemo(() => {
        let result: IGarage[] = garages;

        if (filter === 'vip') {
            result = result.filter((g) => g.tier === 'vip');
        } else if (filter === 'normal') {
            result = result.filter((g) => g.tier === 'normal');
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (g) =>
                    g.name.toLowerCase().includes(q)
                    || g.city.toLowerCase().includes(q)
                    || g.specialty.some((s) => s.toLowerCase().includes(q)),
            );
        }

        return result;
    }, [filter, search]);

    const vipGarages = filteredGarages.filter((g) => g.tier === 'vip');
    const normalGarages = filteredGarages.filter((g) => g.tier === 'normal');

    return (
        <React.Fragment>
            <Head>
                <title>Garages Partenaires — Akodessewa.com</title>
            </Head>

            <div className="garages-page">
                {/* Hero Banner */}
                <div className="garages-page__hero">
                    <div className="garages-page__hero-overlay" />
                    <div className="garages-page__hero-content">
                        <h1 className="garages-page__hero-title">
                            <i className="fas fa-warehouse" />
                            Nos Garages Partenaires
                        </h1>
                        <p className="garages-page__hero-subtitle">
                            Trouvez le garage de confiance le plus proche de vous.
                            Nos partenaires certifies sont prets a prendre soin de votre vehicule.
                        </p>
                    </div>
                </div>

                <div className="container">
                    {/* Search and Filter Bar */}
                    <div className="garages-page__toolbar">
                        <div className="garages-page__search">
                            <i className="fas fa-search" />
                            <input
                                type="text"
                                placeholder="Rechercher un garage, une ville, une specialite..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="garages-page__filters">
                            <button
                                type="button"
                                className={`garages-page__filter-btn ${filter === 'all' ? 'garages-page__filter-btn--active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Tous ({garages.length})
                            </button>
                            <button
                                type="button"
                                className={`garages-page__filter-btn garages-page__filter-btn--vip ${filter === 'vip' ? 'garages-page__filter-btn--active' : ''}`}
                                onClick={() => setFilter('vip')}
                            >
                                <i className="fas fa-crown" /> VIP ({garages.filter((g) => g.tier === 'vip').length})
                            </button>
                            <button
                                type="button"
                                className={`garages-page__filter-btn ${filter === 'normal' ? 'garages-page__filter-btn--active' : ''}`}
                                onClick={() => setFilter('normal')}
                            >
                                Standard ({garages.filter((g) => g.tier === 'normal').length})
                            </button>
                        </div>
                    </div>

                    {/* VIP Section */}
                    {vipGarages.length > 0 && (
                        <div className="garages-page__section">
                            <div className="garages-page__section-header garages-page__section-header--vip">
                                <div className="garages-page__section-title-row">
                                    <i className="fas fa-crown" />
                                    <h2>Garages VIP</h2>
                                </div>
                                <p className="garages-page__section-subtitle">
                                    Nos partenaires premium avec un service d&apos;excellence
                                </p>
                            </div>
                            <div className="garages-page__grid">
                                {vipGarages.map((garage) => (
                                    <GarageCard key={garage.id} garage={garage} layout="grid" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Normal Section */}
                    {normalGarages.length > 0 && (
                        <div className="garages-page__section">
                            <div className="garages-page__section-header">
                                <div className="garages-page__section-title-row">
                                    <i className="fas fa-tools" />
                                    <h2>Garages Partenaires</h2>
                                </div>
                                <p className="garages-page__section-subtitle">
                                    Des professionnels de confiance pres de chez vous
                                </p>
                            </div>
                            <div className="garages-page__grid">
                                {normalGarages.map((garage) => (
                                    <GarageCard key={garage.id} garage={garage} layout="grid" />
                                ))}
                            </div>
                        </div>
                    )}

                    {filteredGarages.length === 0 && (
                        <div className="garages-page__empty">
                            <i className="fas fa-search" />
                            <h3>Aucun garage trouve</h3>
                            <p>Essayez de modifier vos criteres de recherche.</p>
                        </div>
                    )}

                    {/* CTA Banner */}
                    <div className="garages-page__cta-banner">
                        <div className="garages-page__cta-content">
                            <i className="fas fa-handshake garages-page__cta-icon" />
                            <div>
                                <h3>Vous etes garagiste ?</h3>
                                <p>Rejoignez notre reseau de garages partenaires et boostez votre activite.</p>
                            </div>
                        </div>
                        <a
                            href="https://wa.me/22890171212?text=Bonjour, je souhaite devenir garage partenaire sur Akodessewa.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="garages-page__cta-btn"
                        >
                            <i className="fab fa-whatsapp" />
                            Devenir partenaire
                        </a>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default GaragesPage;
