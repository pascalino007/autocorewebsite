// react
import React from 'react';
// application
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

function BlockUsedVehiclesBanner() {
    return (
        <div className="block block-uv-banner">
            <div className="container">
                <div className="block-uv-banner__inner">
                    {/* Background layers */}
                    <div className="block-uv-banner__bg" />
                    <div className="block-uv-banner__overlay" />

                    {/* Content */}
                    <div className="block-uv-banner__content">
                        <div className="block-uv-banner__left">
                            <span className="block-uv-banner__badge">
                                <i className="fas fa-fire" />
                                Nouveau
                            </span>
                            <h2 className="block-uv-banner__title">
                                Achetez &amp; Vendez des
                                <br />
                                <span className="block-uv-banner__title-highlight">
                                    Voitures &amp; Motos d&apos;occasion
                                </span>
                            </h2>
                            <p className="block-uv-banner__desc">
                                Des milliers de véhicules certifiés, inspectés et prêts à rouler.
                                Trouvez la bonne affaire ou vendez votre véhicule facilement sur Akodessewa.com
                            </p>

                            <div className="block-uv-banner__features">
                                <div className="block-uv-banner__feature">
                                    <i className="fas fa-shield-alt" />
                                    <span>Véhicules inspectés</span>
                                </div>
                                <div className="block-uv-banner__feature">
                                    <i className="fas fa-hand-holding-usd" />
                                    <span>Meilleurs prix</span>
                                </div>
                                <div className="block-uv-banner__feature">
                                    <i className="fas fa-file-contract" />
                                    <span>Transactions sécurisées</span>
                                </div>
                            </div>

                            <div className="block-uv-banner__actions">
                                <AppLink href={url.usedVehicles()} className="block-uv-banner__btn block-uv-banner__btn--primary">
                                    <i className="fas fa-car" />
                                    <span>Voir les véhicules</span>
                                </AppLink>
                                <AppLink href={url.usedVehicles()} className="block-uv-banner__btn block-uv-banner__btn--secondary">
                                    <i className="fas fa-motorcycle" />
                                    <span>Motos d&apos;occasion</span>
                                </AppLink>
                            </div>
                        </div>

                        <div className="block-uv-banner__right">
                            <div className="block-uv-banner__card block-uv-banner__card--car">
                                <div className="block-uv-banner__card-icon">
                                    <i className="fas fa-car-side" />
                                </div>
                                <div className="block-uv-banner__card-info">
                                    <span className="block-uv-banner__card-count">500+</span>
                                    <span className="block-uv-banner__card-label">Voitures</span>
                                </div>
                            </div>
                            <div className="block-uv-banner__card block-uv-banner__card--moto">
                                <div className="block-uv-banner__card-icon">
                                    <i className="fas fa-motorcycle" />
                                </div>
                                <div className="block-uv-banner__card-info">
                                    <span className="block-uv-banner__card-count">200+</span>
                                    <span className="block-uv-banner__card-label">Motos</span>
                                </div>
                            </div>
                            <div className="block-uv-banner__card block-uv-banner__card--trusted">
                                <div className="block-uv-banner__card-icon">
                                    <i className="fas fa-user-check" />
                                </div>
                                <div className="block-uv-banner__card-info">
                                    <span className="block-uv-banner__card-count">100+</span>
                                    <span className="block-uv-banner__card-label">Vendeurs vérifiés</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockUsedVehiclesBanner);
