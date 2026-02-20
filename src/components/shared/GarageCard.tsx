// react
import React from 'react';
// application
import AppLink from '~/components/shared/AppLink';
import { IGarage } from '~/data/garages';

interface GarageCardProps {
    garage: IGarage;
    layout?: 'grid' | 'sidebar';
}

function GarageCard({ garage, layout = 'grid' }: GarageCardProps) {
    const href = { href: `/garages/[slug]?slug=${garage.slug}`, as: `/garages/${garage.slug}` };

    return (
        <div className={`garage-card garage-card--${layout} ${garage.tier === 'vip' ? 'garage-card--vip' : ''}`}>
            {garage.tier === 'vip' && (
                <div className="garage-card__vip-badge">
                    <i className="fas fa-crown" />
                    <span>VIP</span>
                </div>
            )}

            <AppLink href={href} className="garage-card__image-link">
                <div className="garage-card__image-wrap">
                    <img
                        src={garage.image}
                        alt={garage.name}
                        className="garage-card__image"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(garage.name)}&size=300&background=d32f2f&color=fff&font-size=0.35`;
                        }}
                    />
                </div>
            </AppLink>

            <div className="garage-card__body">
                <AppLink href={href} className="garage-card__name">
                    {garage.name}
                </AppLink>

                <div className="garage-card__location">
                    <i className="fas fa-map-marker-alt" />
                    <span>{garage.city}, {garage.country}</span>
                </div>

                <div className="garage-card__rating">
                    <div className="garage-card__stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`fa-star ${star <= Math.round(garage.rating) ? 'fas' : 'far'}`}
                            />
                        ))}
                    </div>
                    <span className="garage-card__rating-text">
                        {garage.rating} ({garage.reviewCount} avis)
                    </span>
                </div>

                <div className="garage-card__specialties">
                    {garage.specialty.slice(0, layout === 'sidebar' ? 2 : 3).map((spec) => (
                        <span key={spec} className="garage-card__specialty-tag">{spec}</span>
                    ))}
                </div>

                {layout === 'grid' && (
                    <div className="garage-card__meta">
                        <span className="garage-card__experience">
                            <i className="fas fa-clock" />
                            {garage.yearsInBusiness} ans
                        </span>
                        <span className="garage-card__hours">
                            <i className="fas fa-door-open" />
                            {garage.openHours}
                        </span>
                    </div>
                )}

                <div className="garage-card__actions">
                    <AppLink href={href} className="garage-card__btn garage-card__btn--profile">
                        Voir le profil
                    </AppLink>
                    <a
                        href={`https://wa.me/${garage.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="garage-card__btn garage-card__btn--whatsapp"
                    >
                        <i className="fab fa-whatsapp" />
                    </a>
                    <a
                        href={`tel:${garage.phone}`}
                        className="garage-card__btn garage-card__btn--call"
                    >
                        <i className="fas fa-phone" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default React.memo(GarageCard);
