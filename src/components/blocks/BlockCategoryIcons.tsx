// react
import React from 'react';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

interface CategoryIcon {
    title: string;
    subtitle: string;
    image: string;
}

const categories: CategoryIcon[] = [
    { title: 'Deal of the day', subtitle: '12 Products', image: '/images/products/product-15-1.jpg' },
    { title: 'Lights & Optics', subtitle: '12 Products', image: '/images/categories/category-4.jpg' },
    { title: 'Exhaust System', subtitle: '12 Products', image: '/images/categories/category-5.jpg' },
    { title: 'Braking System', subtitle: '12 Products', image: '/images/categories/category-6.jpg' },
    { title: 'Cooling System', subtitle: '12 Products', image: '/images/categories/category-7.jpg' },
    { title: 'Tires & Wheels', subtitle: '12 Products', image: '/images/products/product-12-2.jpg' },
    { title: 'Suspension', subtitle: '12 Products', image: '/images/products/product-14-2.jpg' },
];

function BlockCategoryIcons() {
    return (
        <div className="block block-category-icons">
            <div className="container">
                <div className="block-category-icons__header">
                    <h3 className="block-title">Performance Parts Categories</h3>
                    <AppLink href={url.products()} className="block-link">
                        See All Shop
                    </AppLink>
                </div>
                <div className="block-category-icons__row">
                    {categories.map((category) => (
                        <AppLink
                            key={category.title}
                            href={url.products()}
                            className="block-category-icons__item"
                        >
                            <div className="block-category-icons__icon">
                                <AppImage className="image__tag" src={category.image} alt={category.title} />
                            </div>
                            <div className="block-category-icons__title">{category.title}</div>
                            <div className="block-category-icons__subtitle">{category.subtitle}</div>
                        </AppLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockCategoryIcons);
