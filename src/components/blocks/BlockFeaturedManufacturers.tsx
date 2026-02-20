// react
import React from 'react';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';
import { IBrand } from '~/interfaces/brand';

interface Manufacturer {
    name: string;
    image: string;
    slug: string;
}

const manufacturers: Manufacturer[] = [
    { name: 'Mitsubishi', image: '/images/avatars/avatar-1.jpg', slug: 'aim-parts' },
    { name: 'BMW', image: '/images/avatars/avatar-2.jpg', slug: 'wind-engine' },
    { name: 'Toyota', image: '/images/avatars/avatar-3.jpg', slug: 'turbo-electric' },
    { name: 'Isuzu', image: '/images/avatars/avatar-4.jpg', slug: 'start-one' },
    { name: 'Mercedes', image: '/images/categories/category-4.jpg', slug: 'brandix' },
    { name: 'Subaru', image: '/images/categories/category-5.jpg', slug: 'abs-brand' },
    { name: 'Hyundai', image: '/images/categories/category-6.jpg', slug: 'great-circle' },
    { name: 'Chevrolet', image: '/images/categories/category-7.jpg', slug: 'just-romb' },
    { name: 'Ford', image: '/images/banners/banner1.jpg', slug: 'fast-wheels' },
    { name: 'Mazda', image: '/images/banners/banner2.jpg', slug: 'stroyka-x' },
    { name: 'Suzuki', image: '/images/finder.jpg', slug: 'mission-51' },
    { name: 'Peugeot', image: '/images/about.jpg', slug: 'fuel-corp' },
];

function BlockFeaturedManufacturers() {
    return (
        <div className="block block-featured-manufacturers">
            <div className="container">
                <div className="block-featured-manufacturers__header">
                    <h3 className="block-title">Featured Manufacturers</h3>
                    <AppLink href={url.products()} className="block-link">
                        Join us now
                    </AppLink>
                </div>
                <div className="block-featured-manufacturers__grid">
                    {manufacturers.map((item) => {
                        const fakeBrand: IBrand = {
                            slug: item.slug,
                            name: item.name,
                            image: item.image,
                            country: '',
                        };

                        return (
                            <AppLink
                                key={item.name}
                                href={url.brand(fakeBrand)}
                                className="block-featured-manufacturers__item"
                            >
                                <div className="block-featured-manufacturers__logo">
                                    <AppImage className="image__tag" src={item.image} alt={item.name} />
                                </div>
                                <div className="block-featured-manufacturers__name">{item.name}</div>
                            </AppLink>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockFeaturedManufacturers);
