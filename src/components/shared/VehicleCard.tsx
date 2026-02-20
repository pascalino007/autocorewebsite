// react
import React from 'react';
// third-party
import classNames from 'classnames';
// application
import AppImage from '~/components/shared/AppImage';
import CurrencyFormat from '~/components/shared/CurrencyFormat';
import { IUsedVehicle } from '~/data/usedVehicles';

interface Props extends React.HTMLAttributes<HTMLElement> {
    vehicle: IUsedVehicle;
}

function VehicleCard(props: Props) {
    const { vehicle, className, ...rootProps } = props;

    const rootClasses = classNames('vehicle-card', className);

    const whatsappUrl = `https://wa.me/${vehicle.sellerWhatsApp}?text=${encodeURIComponent(
        `Bonjour, je suis intéressé par votre ${vehicle.title} (réf #${vehicle.id}) sur Akodessewa.com`,
    )}`;

    const hasDiscount = vehicle.compareAtPrice && vehicle.compareAtPrice > vehicle.price;
    const discountPct = hasDiscount
        ? Math.round((1 - vehicle.price / vehicle.compareAtPrice!) * 100)
        : 0;

    return (
        <div className={rootClasses} {...rootProps}>
            {/* Image */}
            <div className="vehicle-card__image">
                <AppImage className="vehicle-card__img" src={vehicle.image} />

                {/* Condition badge */}
                <span className="vehicle-card__condition">{vehicle.condition}</span>

                {hasDiscount && (
                    <span className="vehicle-card__discount">-{discountPct}%</span>
                )}

                {/* Type badge */}
                <span className="vehicle-card__type-badge">
                    <i className={vehicle.type === 'car' ? 'fas fa-car' : 'fas fa-motorcycle'} />
                </span>
            </div>

            {/* Body */}
            <div className="vehicle-card__body">
                {/* Brand + Year line */}
                <div className="vehicle-card__brand-line">
                    <span className="vehicle-card__brand">{vehicle.brand}</span>
                    <span className="vehicle-card__year">{vehicle.year}</span>
                </div>

                {/* Model */}
                <h3 className="vehicle-card__model">{vehicle.model}</h3>

                {/* Specs row */}
                <div className="vehicle-card__specs">
                    <span className="vehicle-card__spec">
                        <i className="fas fa-tachometer-alt" />
                        {vehicle.mileage.toLocaleString()} km
                    </span>
                    <span className="vehicle-card__spec">
                        <i className="fas fa-cog" />
                        {vehicle.transmission}
                    </span>
                    <span className="vehicle-card__spec">
                        <i className="fas fa-gas-pump" />
                        {vehicle.fuelType}
                    </span>
                </div>

                {/* Color + Body */}
                <div className="vehicle-card__meta-row">
                    <span className="vehicle-card__meta-item">
                        <i className="fas fa-palette" />
                        {vehicle.color}
                    </span>
                    <span className="vehicle-card__meta-item">
                        <i className="fas fa-car-side" />
                        {vehicle.bodyStyle}
                    </span>
                </div>

                {/* Location */}
                <div className="vehicle-card__location">
                    <i className="fas fa-map-marker-alt" />
                    {vehicle.location}
                </div>
            </div>

            {/* Footer: Price + WhatsApp */}
            <div className="vehicle-card__footer">
                <div className="vehicle-card__prices">
                    <span className="vehicle-card__price">
                        <CurrencyFormat value={vehicle.price} />
                    </span>
                    {hasDiscount && (
                        <span className="vehicle-card__price-old">
                            <CurrencyFormat value={vehicle.compareAtPrice!} />
                        </span>
                    )}
                </div>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vehicle-card__whatsapp"
                    title={`Contacter ${vehicle.sellerName}`}
                >
                    <i className="fab fa-whatsapp" />
                    <span className="vehicle-card__seller-name">{vehicle.sellerName}</span>
                </a>
            </div>
        </div>
    );
}

export default React.memo(VehicleCard);
