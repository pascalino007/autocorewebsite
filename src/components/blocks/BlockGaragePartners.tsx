// react
import React from 'react';
// application
import AppLink from '~/components/shared/AppLink';
import GarageCard from '~/components/shared/GarageCard';
import garages from '~/data/garages';

function BlockGaragePartners() {
    const vipGarages = garages.filter((g) => g.tier === 'vip');
    const normalGarages = garages.filter((g) => g.tier === 'normal');
    const displayGarages = [...vipGarages, ...normalGarages].slice(0, 6);

    return (
        <div className="block-garage-partners-full">
            {/* Section Header */}
            <div className="container">
                <div className="block-garage-partners-full__header">
                    <div className="block-garage-partners-full__title-area">
                        <div className="block-garage-partners-full__icon-circle">
                            <i className="fas fa-warehouse" />
                        </div>
                        <div>
                            <h2 className="block-garage-partners-full__title">
                                Nos Garages Partenaires
                            </h2>
                            <p className="block-garage-partners-full__subtitle">
                                Des professionnels certifies pour l&apos;entretien et la reparation de votre vehicule
                            </p>
                        </div>
                    </div>
                    <AppLink href="/garages" className="block-garage-partners-full__view-all-btn">
                        Voir tous les garages
                        <i className="fas fa-arrow-right" />
                    </AppLink>
                </div>
            </div>

            {/* Garages Grid */}
            <div className="container">
                <div className="block-garage-partners-full__grid">
                    {displayGarages.map((garage) => (
                        <GarageCard key={garage.id} garage={garage} layout="grid" />
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="container">
                <div className="block-garage-partners-full__cta">
                    <div className="block-garage-partners-full__cta-left">
                        <i className="fas fa-handshake" />
                        <div>
                            <h4>Vous etes garagiste ?</h4>
                            <p>Rejoignez notre reseau et recevez des clients directement depuis Akodessewa.com</p>
                        </div>
                    </div>
                    <a
                        href="https://wa.me/22890171212?text=Bonjour, je souhaite devenir garage partenaire sur Akodessewa.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block-garage-partners-full__cta-btn"
                    >
                        <i className="fab fa-whatsapp" />
                        Devenir partenaire
                    </a>
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockGaragePartners);
