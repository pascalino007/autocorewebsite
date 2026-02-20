// react
import React from 'react';
// application
import AppLink from '~/components/shared/AppLink';
import ProductCard from '~/components/shared/ProductCard';
import { shopApi } from '~/api';

interface BlockAccessoriesProps {
    title?: string;
    subtitle?: string;
    categorySlug?: string;
}

function BlockAccessories({ 
    title = "Accessoires Utiles", 
    subtitle = "Découvrez nos accessoires essentiels pour votre véhicule",
    categorySlug = "accessoires"
}: BlockAccessoriesProps) {
    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAccessories = async () => {
            try {
                // Fetch products by subcategory using filters
                const response = await shopApi.getProductsList(
                    { limit: 10 },
                    { category: categorySlug }
                );
                setProducts(response.items || []);
            } catch (error) {
                console.error('Failed to fetch accessories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccessories();
    }, [categorySlug]);

    if (loading) {
        return (
            <div className="block-accessories">
                <div className="container">
                    <div className="block-accessories__header">
                        <div className="block-accessories__title-area">
                            <div className="block-accessories__icon-circle">
                                <i className="fas fa-tools" />
                            </div>
                            <div>
                                <h2 className="block-accessories__title">{title}</h2>
                                <p className="block-accessories__subtitle">{subtitle}</p>
                            </div>
                        </div>
                    </div>
                    <div className="block-accessories__grid">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="block-accessories__card skeleton">
                                <div className="block-accessories__card-image skeleton" />
                                <div className="block-accessories__card-content">
                                    <div className="block-accessories__card-title skeleton" />
                                    <div className="block-accessories__card-price skeleton" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="block-accessories">
            <div className="container">
                <div className="block-accessories__header">
                    <div className="block-accessories__title-area">
                        <div className="block-accessories__icon-circle">
                            <i className="fas fa-tools" />
                        </div>
                        <div>
                            <h2 className="block-accessories__title">{title}</h2>
                            <p className="block-accessories__subtitle">{subtitle}</p>
                        </div>
                    </div>
                    <AppLink href={`/shop/category/${categorySlug}`} className="block-accessories__view-all-btn">
                        Voir tout
                        <i className="fas fa-arrow-right" />
                    </AppLink>
                </div>

                <div className="block-accessories__grid">
                    {products.slice(0, 10).map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product}
                            layout="grid"
                            exclude={['features', 'compare', 'quickview']}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockAccessories);
