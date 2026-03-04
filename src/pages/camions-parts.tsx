// react
import React from 'react';
// third-party
import { GetServerSideProps } from 'next';
// application
import ShopPageCategory from '~/components/shop/ShopPageCategory';
import SitePageNotFound from '~/components/site/SitePageNotFound';
import { IShopCategory } from '~/interfaces/category';
import { shopApi } from '~/api';

interface Props {
    category: IShopCategory | null;
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    let category: IShopCategory | null = null;
    try {
        category = await shopApi.getCategoryBySlug('camions-parts', { depth: 2 });
    } catch {
        try {
            category = await shopApi.getCategoryBySlug('pieces-poids-lourd', { depth: 2 });
        } catch {
            // no category yet in backend
        }
    }

    return {
        props: {
            category,
        },
    };
};

function Page(props: Props) {
    const { category } = props;

    if (!category) {
        return <SitePageNotFound />;
    }

    return (
        <ShopPageCategory
            layout="columns-4-sidebar"
            category={category}
            vehicleType="TRUCK"
        />
    );
}

export default Page;
