// react
import React, { useMemo, useState } from 'react';
// third-party
import classNames from 'classnames';
import { useIntl } from 'react-intl';
// application
import AnalogsTable from '~/components/shop/AnalogsTable';
import AppLink from '~/components/shared/AppLink';
import ReviewsView from '~/components/shop/ReviewsView';
import { IProduct } from '~/interfaces/product';
import { IProductPageLayout } from '~/interfaces/pages';

export interface ITab {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
    counter?: number;
    showCounter?: boolean;
}

/* ---------- compatible-vehicles mock data ---------- */
interface ICompatibleVehicle {
    id: number;
    make: string;
    model: string;
    year: string;
    engine: string;
    image: string;
}

const compatibleVehicles: ICompatibleVehicle[] = [
    { id: 1, make: 'Toyota', model: 'Camry', year: '2018 – 2023', engine: '2.5 L 4-Cyl', image: 'https://cdn.imagin.studio/getimage?customer=img&make=toyota&modelFamily=camry&paintId=pspc0040&angle=01&width=400' },
    { id: 2, make: 'Honda', model: 'Accord', year: '2017 – 2022', engine: '1.5 L Turbo', image: 'https://cdn.imagin.studio/getimage?customer=img&make=honda&modelFamily=accord&paintId=pspc0040&angle=01&width=400' },
    { id: 3, make: 'Nissan', model: 'Altima', year: '2019 – 2023', engine: '2.5 L 4-Cyl', image: 'https://cdn.imagin.studio/getimage?customer=img&make=nissan&modelFamily=altima&paintId=pspc0040&angle=01&width=400' },
    { id: 4, make: 'Hyundai', model: 'Sonata', year: '2020 – 2024', engine: '2.5 L GDI', image: 'https://cdn.imagin.studio/getimage?customer=img&make=hyundai&modelFamily=sonata&paintId=pspc0040&angle=01&width=400' },
    { id: 5, make: 'Kia', model: 'K5', year: '2021 – 2024', engine: '1.6 L Turbo', image: 'https://cdn.imagin.studio/getimage?customer=img&make=kia&modelFamily=k5&paintId=pspc0040&angle=01&width=400' },
    { id: 6, make: 'Ford', model: 'Fusion', year: '2016 – 2020', engine: '2.0 L EcoBoost', image: 'https://cdn.imagin.studio/getimage?customer=img&make=ford&modelFamily=fusion&paintId=pspc0040&angle=01&width=400' },
];

/* ---------- helpers ---------- */
function CompatibilityTable() {
    return (
        <div className="compatibility-section">
            <p className="compatibility-section__intro">
                Cette pièce est compatible avec les véhicules suivants. Veuillez vérifier
                l&#39;année, le modèle et la motorisation avant de commander.
            </p>
            <div className="compatibility-table-wrap">
                <table className="compatibility-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Marque</th>
                            <th>Modèle</th>
                            <th>Année</th>
                            <th>Moteur</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compatibleVehicles.map((v) => (
                            <tr key={v.id}>
                                <td className="compatibility-table__img-cell">
                                    <img src={v.image} alt={`${v.make} ${v.model}`} />
                                </td>
                                <td><strong>{v.make}</strong></td>
                                <td>{v.model}</td>
                                <td>{v.year}</td>
                                <td>{v.engine}</td>
                                <td>
                                    <span className="compatibility-badge">
                                        <i className="fas fa-check-circle" /> Compatible
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ProductInfo({ product }: { product: IProduct }) {
    return (
        <div className="product-info-section">
            <div className="product-info-section__grid">
                <div className="product-info-card">
                    <i className="fas fa-shield-alt product-info-card__icon" />
                    <h4>Garantie</h4>
                    <p>12 mois de garantie constructeur sur cette pièce.</p>
                </div>
                <div className="product-info-card">
                    <i className="fas fa-truck product-info-card__icon" />
                    <h4>Livraison</h4>
                    <p>Expédition sous 24-48h. Livraison calculée selon votre position.</p>
                </div>
                <div className="product-info-card">
                    <i className="fas fa-undo product-info-card__icon" />
                    <h4>Retours</h4>
                    <p>Retour gratuit sous 30 jours si la pièce ne correspond pas.</p>
                </div>
                <div className="product-info-card">
                    <i className="fas fa-certificate product-info-card__icon" />
                    <h4>Qualité certifiée</h4>
                    <p>Toutes les pièces sont vérifiées et certifiées OEM ou équivalent.</p>
                </div>
            </div>
            {product.attributes.length > 0 && (
                <div className="product-info-section__specs">
                    <h4 className="product-info-section__specs-title">Caractéristiques</h4>
                    <table className="product-info-section__specs-table">
                        <tbody>
                            {product.attributes.slice(0, 8).map((attr, idx) => (
                                <tr key={idx}>
                                    <td className="product-info-section__spec-name">{attr.name}</td>
                                    <td className="product-info-section__spec-value">
                                        {attr.values.map((x) => x.name).join(', ')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

interface Props extends React.HTMLAttributes<HTMLElement> {
    product: IProduct;
    layout: IProductPageLayout;
}

function ProductTabs(props: Props) {
    const intl = useIntl();
    const {
        product,
        layout,
        className,
        ...rootProps
    } = props;

    const tabs = useMemo<ITab[]>(() => [
        {
            id: 'product-tab-compatibility',
            title: 'Compatibilité',
            content: (<CompatibilityTable />),
        },
        {
            id: 'product-tab-info',
            title: 'Informations Produit',
            content: (<ProductInfo product={product} />),
        },
        {
            id: 'product-tab-reviews',
            title: intl.formatMessage({ id: 'TEXT_TAB_REVIEWS' }),
            content: (<ReviewsView productId={product.id} productPageLayout={layout} />),
            counter: product.reviews,
            showCounter: typeof product.reviews === 'number' && product.reviews > 0,
        },
        {
            id: 'product-tab-analogs',
            title: intl.formatMessage({ id: 'TEXT_TAB_ANALOGS' }),
            content: (<AnalogsTable productId={product.id} />),
        },
    ], [layout, product, intl]);
    const [activeTab, setActiveTab] = useState(tabs[0]?.id);

    const rootClasses = classNames(`product-tabs product-tabs--layout--${layout}`, className);

    return (
        <div className={rootClasses} {...rootProps}>
            {tabs.map((tab, index) => (
                <div key={index} id={tab.id} />
            ))}
            <ul className="product-tabs__list">
                {tabs.map((tab, index) => (
                    <li
                        key={index}
                        className={classNames('product-tabs__item', {
                            'product-tabs__item--active': activeTab === tab.id,
                        })}
                    >
                        <AppLink href={{ href: { hash: tab.id } }} onClick={() => setActiveTab(tab.id)}>
                            {tab.title}
                            {tab.showCounter && (
                                <span className="product-tabs__item-counter">{tab.counter}</span>
                            )}
                        </AppLink>
                    </li>
                ))}
            </ul>
            <div className="product-tabs__content">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={classNames('product-tabs__pane', {
                            'product-tabs__pane--active': activeTab === tab.id,
                        })}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductTabs;
