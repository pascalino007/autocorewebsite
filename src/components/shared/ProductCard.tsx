// react
import React, { useMemo } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AppImage from '~/components/shared/AppImage';
import AppLink from '~/components/shared/AppLink';
import AsyncAction from '~/components/shared/AsyncAction';
import CompatibilityStatusBadge from '~/components/shared/CompatibilityStatusBadge';
import CurrencyFormat from '~/components/shared/CurrencyFormat';
import Rating from '~/components/shared/Rating';
import url from '~/services/url';
import { haversineDistance, useUserLocation, getCountryCoords } from '~/services/userLocation';
import { IProduct } from '~/interfaces/product';
import { useCartAddItem } from '~/store/cart/cartHooks';
import { useCompareAddItem } from '~/store/compare/compareHooks';
import { useQuickviewOpen } from '~/store/quickview/quickviewHooks';
import { useWishlistAddItem } from '~/store/wishlist/wishlistHooks';
import {
    Cart20Svg,
    Compare16Svg,
    Quickview16Svg,
    Wishlist16Svg,
} from '~/svg';

export type IProductCardElement = 'actions' | 'status-badge' | 'meta' | 'features' | 'buttons' | 'list-buttons' | 'supplier' | 'availability' | 'rating';

export type IProductCardLayout = 'grid' | 'list' | 'table' | 'horizontal';

interface Props extends React.HTMLAttributes<HTMLElement> {
    product: IProduct;
    layout?: IProductCardLayout;
    exclude?: IProductCardElement[];
}

function ProductCard(props: Props) {
    const {
        product,
        layout,
        exclude = [],
        className,
        ...rootProps
    } = props;
    const intl = useIntl();
    const featuredAttributes = product.attributes.filter((x) => x.featured);
    const cartAddItem = useCartAddItem();
    const quickviewOpen = useQuickviewOpen();
    const compareAddItem = useCompareAddItem();
    const wishlistAddItem = useWishlistAddItem();

    const userLocation = useUserLocation();
    const showQuickview = () => quickviewOpen(product.slug);
    const addToWishlist = () => wishlistAddItem(product);
    const addToCompare = () => compareAddItem(product);

    // Compute distance and delivery info
    const deliveryInfo = useMemo(() => {
        if (!userLocation.loaded || !userLocation.latitude || !product.shop) {
            return null;
        }

        const shop = product.shop;
        // Get supplier coordinates: from shop directly, or fallback to country lookup
        let supplierLat = shop.latitude || 0;
        let supplierLng = shop.longitude || 0;

        if (!supplierLat && !supplierLng && shop.country) {
            const coords = getCountryCoords(shop.country);
            if (coords) {
                supplierLat = coords.lat;
                supplierLng = coords.lng;
            }
        }

        if (!supplierLat && !supplierLng) {
            return null;
        }

        const distanceKm = haversineDistance(
            userLocation.latitude,
            userLocation.longitude,
            supplierLat,
            supplierLng,
        );

        const isSameCountry = userLocation.countryCode === shop.country;
        // 100 FCFA/km — reasonable local delivery rate
        const deliveryCostFcfa = Math.round(distanceKm * 100);
        // Convert to USD base (1 USD = 603 FCFA) so CurrencyFormat can convert to any currency
        const deliveryCostBase = Math.round((deliveryCostFcfa / 603) * 100) / 100;

        const distanceLabel = distanceKm < 1
            ? '< 1 km'
            : distanceKm < 100
                ? `${Math.round(distanceKm)} km`
                : `${Math.round(distanceKm).toLocaleString()} km`;

        return {
            distanceKm,
            distanceLabel,
            isSameCountry,
            deliveryCostBase,
        };
    }, [userLocation, product.shop]);
    // Store fee in base (USD) currency so the cart & CurrencyFormat work everywhere
    const deliveryFee = (
        product.stock === 'in-stock'
        && deliveryInfo
        && deliveryInfo.distanceKm <= 100
    ) ? deliveryInfo.deliveryCostBase : 0;

    const rootClasses = classNames('product-card', className, {
        [`product-card--layout--${layout}`]: layout,
    });

    // One combined vendor + delivery line for the redesign
    const hasDeliveryInfo = product.stock === 'in-stock' && deliveryInfo && deliveryInfo.distanceKm <= 100;
    const vendorLine = product.shop
        ? (hasDeliveryInfo
            ? `${product.shop.name} · ${deliveryInfo!.distanceLabel}`
            : product.shop.name)
        : 'Akodessewa';

    return (
        <div className={rootClasses} {...rootProps}>
            {/* Image block */}
            <div className="product-card__image">
                <div className="image image--type--product">
                    <AppLink href={url.product(product)} className="image__body">
                        {product.images?.[0] ? (
                            <AppImage className="image__tag" src={product.images[0]} />
                        ) : (
                            <div className="product-card__image-placeholder" />
                        )}
                    </AppLink>
                </div>
                {product.badges && product.badges.length > 0 && (
                    <div className="product-card__badges">
                        {product.badges.map((badge) => (
                            <span key={badge} className={classNames('product-card__badge-pill', `product-card__badge-pill--${badge}`)}>
                                {badge === 'sale' && product.compareAtPrice != null && product.compareAtPrice > 0
                                    ? `-${Math.round((1 - product.price / product.compareAtPrice) * 100)}%`
                                    : badge.charAt(0).toUpperCase() + badge.slice(1)}
                            </span>
                        ))}
                    </div>
                )}
                {!exclude.includes('status-badge') && (
                    <CompatibilityStatusBadge className="product-card__fit" product={product} />
                )}
                <div className="product-card__actions-list">
                    <AsyncAction
                        action={() => showQuickview()}
                        render={({ run, loading }) => (
                            <button
                                type="button"
                                className={classNames('product-card__action product-card__action--quickview', {
                                    'product-card__action--loading': loading,
                                })}
                                aria-label={intl.formatMessage({ id: 'BUTTON_QUICKVIEW' })}
                                onClick={run}
                            >
                                <Quickview16Svg />
                            </button>
                        )}
                    />
                    {!exclude.includes('actions') && (
                        <>
                            <AsyncAction
                                action={() => addToWishlist()}
                                render={({ run, loading }) => (
                                    <button
                                        type="button"
                                        className={classNames('product-card__action product-card__action--wishlist', {
                                            'product-card__action--loading': loading,
                                        })}
                                        aria-label={intl.formatMessage({ id: 'BUTTON_ADD_TO_WISHLIST' })}
                                        onClick={run}
                                    >
                                        <Wishlist16Svg />
                                    </button>
                                )}
                            />
                            <AsyncAction
                                action={() => addToCompare()}
                                render={({ run, loading }) => (
                                    <button
                                        type="button"
                                        className={classNames('product-card__action product-card__action--compare', {
                                            'product-card__action--loading': loading,
                                        })}
                                        aria-label={intl.formatMessage({ id: 'BUTTON_ADD_TO_COMPARE' })}
                                        onClick={run}
                                    >
                                        <Compare16Svg />
                                    </button>
                                )}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="product-card__info">
                <h3 className="product-card__name">
                    <AppLink href={url.product(product)} className="product-card__name-link">
                        {product.name}
                    </AppLink>
                </h3>

                {(!exclude.includes('rating') || !exclude.includes('meta')) && (
                    <div className="product-card__meta-line">
                        {!exclude.includes('rating') && (
                            <span className="product-card__rating-inline">
                                <Rating className="product-card__rating-stars" value={product.rating || 0} />
                                <span className="product-card__rating-text">
                                    {product.rating != null ? Number(product.rating).toFixed(1) : '—'}
                                    {product.reviews != null && product.reviews > 0 && ` (${product.reviews})`}
                                </span>
                            </span>
                        )}
                        {(product.sku || product.partNumber) && !exclude.includes('meta') && (
                            <span className="product-card__sku">{product.sku || product.partNumber}</span>
                        )}
                    </div>
                )}

                {/* Vendor + delivery single row */}
                {(!exclude.includes('supplier') || !exclude.includes('availability')) && (
                    <div className="product-card__vendor-row">
                        {product.shop ? (
                            <AppLink href={url.shop(product.shop)} className="product-card__vendor-name">
                                {vendorLine}
                            </AppLink>
                        ) : (
                            <span className="product-card__vendor-name product-card__vendor-name--standard">
                                {vendorLine}
                            </span>
                        )}
                        {hasDeliveryInfo && (
                            <span className="product-card__delivery-fee">
                                <CurrencyFormat value={deliveryInfo!.deliveryCostBase} />
                            </span>
                        )}
                        {product.stock === 'in-stock' && !hasDeliveryInfo && (
                            <span className="product-card__stock product-card__stock--in">En stock</span>
                        )}
                        {product.stock === 'out-of-stock' && (
                            <span className="product-card__stock product-card__stock--out">Rupture</span>
                        )}
                        {product.stock === 'on-backorder' && (
                            <span className="product-card__stock product-card__stock--backorder">Sur commande</span>
                        )}
                    </div>
                )}

                {!exclude.includes('features') && featuredAttributes.length > 0 && (
                    <ul className="product-card__features">
                        {featuredAttributes.slice(0, 2).map((attribute, index) => (
                            <li key={index}>
                                {attribute.name}: {attribute.values.map((x) => x.name).join(', ')}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer: price + CTA */}
            <div className="product-card__footer">
                <div className="product-card__prices">
                    {product.compareAtPrice != null && product.compareAtPrice > product.price && (
                        <>
                            <span className="product-card__price product-card__price--current">
                                <CurrencyFormat value={product.price} />
                            </span>
                            <span className="product-card__price product-card__price--old">
                                <CurrencyFormat value={product.compareAtPrice} />
                            </span>
                            <span className="product-card__price-discount">
                                -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                            </span>
                        </>
                    )}
                    {(!product.compareAtPrice || product.compareAtPrice <= product.price) && (
                        <span className="product-card__price product-card__price--current">
                            <CurrencyFormat value={product.price} />
                        </span>
                    )}
                </div>
                {!exclude.includes('buttons') && (
                    <>
                        <AsyncAction
                            action={() => cartAddItem(product, [], 1, deliveryFee)}
                            render={({ run, loading }) => (
                                <button
                                    type="button"
                                    className={classNames('product-card__addtocart', {
                                        'product-card__addtocart--loading': loading,
                                    })}
                                    aria-label={intl.formatMessage({ id: 'BUTTON_ADD_TO_CART' })}
                                    onClick={run}
                                >
                                    <Cart20Svg className="product-card__addtocart-icon" />
                                    <span className="product-card__addtocart-text">
                                        <FormattedMessage id="BUTTON_ADD_TO_CART" />
                                    </span>
                                </button>
                            )}
                        />
                        {!exclude.includes('list-buttons') && (
                            <div className="product-card__secondary-actions">
                                <AsyncAction
                                    action={() => addToWishlist()}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            className={classNames('product-card__secondary-btn', {
                                                'product-card__secondary-btn--loading': loading,
                                            })}
                                            onClick={run}
                                            aria-label={intl.formatMessage({ id: 'BUTTON_ADD_TO_WISHLIST' })}
                                        >
                                            <Wishlist16Svg />
                                        </button>
                                    )}
                                />
                                <AsyncAction
                                    action={() => addToCompare()}
                                    render={({ run, loading }) => (
                                        <button
                                            type="button"
                                            className={classNames('product-card__secondary-btn', {
                                                'product-card__secondary-btn--loading': loading,
                                            })}
                                            onClick={run}
                                            aria-label={intl.formatMessage({ id: 'BUTTON_ADD_TO_COMPARE' })}
                                        >
                                            <Compare16Svg />
                                        </button>
                                    )}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default React.memo(ProductCard);
