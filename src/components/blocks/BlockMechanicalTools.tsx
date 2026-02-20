// react
import React from 'react';
// application
import AppLink from '~/components/shared/AppLink';
import ProductCard from '~/components/shared/ProductCard';
import { shopApi } from '~/api';

interface BlockMechanicalToolsProps {
    title?: string;
    subtitle?: string;
    categorySlug?: string;
}

function BlockMechanicalTools({ 
    title = "Outils Mécanique", 
    subtitle = "Outils professionnels pour l'entretien et la réparation",
    categorySlug = "outils-mecanique"
}: BlockMechanicalToolsProps) {
    const [products, setProducts] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTools = async () => {
            try {
                // Fetch products by subcategory using filters
                const response = await shopApi.getProductsList(
                    { limit: 10 },
                    { category: categorySlug }
                );
                setProducts(response.items || []);
            } catch (error) {
                console.error('Failed to fetch mechanical tools:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, [categorySlug]);

    if (loading) {
        return (
            <div className="block-mechanical-tools">
                <div className="container">
                    <div className="block-mechanical-tools__header">
                        <div className="block-mechanical-tools__title-area">
                            <div className="block-mechanical-tools__icon-circle">
                                <i className="fas fa-wrench" />
                            </div>
                            <div>
                                <h2 className="block-mechanical-tools__title">{title}</h2>
                                <p className="block-mechanical-tools__subtitle">{subtitle}</p>
                            </div>
                        </div>
                    </div>
                    <div className="block-mechanical-tools__grid">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="block-mechanical-tools__card skeleton">
                                <div className="block-mechanical-tools__card-image skeleton" />
                                <div className="block-mechanical-tools__card-content">
                                    <div className="block-mechanical-tools__card-title skeleton" />
                                    <div className="block-mechanical-tools__card-price skeleton" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="block-mechanical-tools">
            <div className="container">
                <div className="block-mechanical-tools__header">
                    <div className="block-mechanical-tools__title-area">
                        <div className="block-mechanical-tools__icon-circle">
                            <i className="fas fa-wrench" />
                        </div>
                        <div>
                            <h2 className="block-mechanical-tools__title">{title}</h2>
                            <p className="block-mechanical-tools__subtitle">{subtitle}</p>
                        </div>
                    </div>
                    <AppLink href={`/shop/category/${categorySlug}`} className="block-mechanical-tools__view-all-btn">
                        Voir tout
                        <i className="fas fa-arrow-right" />
                    </AppLink>
                </div>

                <div className="block-mechanical-tools__grid">
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

export default React.memo(BlockMechanicalTools);
