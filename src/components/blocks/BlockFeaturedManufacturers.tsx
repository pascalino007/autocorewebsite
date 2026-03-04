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
    { name: 'Mitsubishi', image: '/images/car-logo/Mitsubishi-logo.png', slug: 'mitsubishi' },
    { name: 'BMW', image: '/images/car-logo/bmw.png', slug: 'bmw' },
    { name: 'Toyota', image: '/images/car-logo/toyota.png', slug: 'toyota' },
    { name: 'Isuzu', image: '/images/car-logo/isuzu.png', slug: 'isuzu' },
    { name: 'Mercedes', image: '/images/car-logo/mercedes.png', slug: 'brandix' },
    { name: 'Honda', image: '/images/categories/category-5.jpg', slug: 'abs-brand' },
    { name: 'Hyundai', image: '/images/car-logo/hyundai.png', slug: 'hyundai' },
    { name: 'Chevrolet', image: '/images/car-logo/chevrolet.png', slug: 'chevrolet' },
    { name: 'Ford', image: '/images/car-logo/ford.jpg', slug: 'ford' },
    { name: 'Mazda', image: '/images/car-logo/mazda.jpg', slug: 'mazda' },
    { name: 'Suzuki', image: '/images/finder.jpg', slug: 'mission-51' },
    { name: 'Peugeot', image: '/images/about.jpg', slug: 'fuel-corp' },
    { name: 'Audi', image: '/images/about.jpg', slug: 'fuel-corp' },
    { name: 'Kia', image: '/images/about.jpg', slug: 'fuel-corp' },
    

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
                                //href={url.brand(fakeBrand)}
                                href={url.brand(fakeBrand)}
                                className="block-featured-manufacturers__item"
                            >
                                <div className="block-featured-manufacturers__logo">
                                    <AppImage className="image__tag" style={{width: 80 , height: 50}} src={item.image} alt={item.name} />
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
