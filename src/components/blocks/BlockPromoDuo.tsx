// react
import React from 'react';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

interface Promo {
    title: string;
    subtitle: string;
    image: string;
    cta: string;
}

const promos: Promo[] = [
    {
        title: 'Only this week',
        subtitle: 'Save $20 off full synthetic oil change with coupon',
        image: '',
        cta: 'Shop Now',
    },
    {
        title: 'With big deals',
        subtitle: 'Up to $100 off select brake service packages',
        image: '',
        cta: 'Shop Now',
    },
];

function BlockPromoDuo() {
    return (
        <div className="block block-promo-duo">
            <div className="container">
                <div className="block-promo-duo__row">
                    {promos.map((promo) => (
                        <div key={promo.title} className="block-promo-duo__card">
                            <div className="block-promo-duo__content">
                                <div className="block-promo-duo__title">{promo.title}</div>
                                <div className="block-promo-duo__subtitle">{promo.subtitle}</div>
                                <AppLink href={url.products()} className="btn btn-primary btn-sm">
                                    {promo.cta}
                                </AppLink>
                            </div>
                            <div className="block-promo-duo__image">
                                <AppImage className="image__tag" src={promo.image} alt={promo.title} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockPromoDuo);
