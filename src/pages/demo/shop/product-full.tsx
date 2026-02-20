// react
import React from 'react';
// third-party
import { GetServerSideProps } from 'next';
// application
import ShopPageProduct from '~/components/shop/ShopPageProduct';
import { IProduct } from '~/interfaces/product';
import { shopApi } from '~/api';
import { sanitizeProductForSSP } from '~/utils/serialization';

interface Props {
    product: IProduct;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    try {
        const rawProduct = await shopApi.getProductBySlug('plaquettes-frein-avant-bosch');
        return {
            props: {
                product: sanitizeProductForSSP(rawProduct),
            },
        };
    } catch (error) {
        console.error('Failed to fetch demo product:', error);
        return {
            notFound: true,
        };
    }
};

function Page(props: Props) {
    const { product } = props;

    return (
        <ShopPageProduct
            product={product}
            layout="full"
        />
    );
}

export default Page;
