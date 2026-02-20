// react
import React from 'react';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

function BlockBanners() {
    return (
        <div className="block block-banners">
            <div className="container">
                <div className="block-banners__list">
                    <AppLink href={url.motoParts()} className="block-banners__item block-banners__item--style--one">
                        <span className="block-banners__item-image">
                            <AppImage className="reflect-rtl" src="/images/banners/banner1.jpg" />
                        </span>
                        <span className="block-banners__item-image block-banners__item-image--blur">
                            <AppImage className="reflect-rtl" src="/images/banners/banner1.jpg" />
                        </span>
                        <span className="block-banners__item-title">
                            Moto Parts & Accessories
                        </span>
                        <span className="block-banners__item-details">
                            Performance upgrades, touring essentials, and reliable spares for every ride.
                        </span>
                        <span className="block-banners__item-button btn btn-primary btn-sm">
                            Shop Moto Parts
                        </span>
                    </AppLink>

                    <AppLink href={url.usedVehicles()} className="block-banners__item block-banners__item--style--two">
                        <span className="block-banners__item-image">
                            <AppImage className="reflect-rtl" src="/images/banners/banner2.jpg" />
                        </span>
                        <span className="block-banners__item-image block-banners__item-image--blur">
                            <AppImage className="reflect-rtl" src="/images/banners/banner2.jpg" />
                        </span>
                        <span className="block-banners__item-title">
                            Used Cars & Motorcycles
                        </span>
                        <span className="block-banners__item-details">
                            Quality inspected listings with transparent history and fair pricing.
                        </span>
                        <span className="block-banners__item-button btn btn-primary btn-sm">
                            Browse Used Vehicles
                        </span>
                    </AppLink>
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockBanners);
