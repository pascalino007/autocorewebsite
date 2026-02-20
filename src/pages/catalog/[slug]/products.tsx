// react
import React from 'react';
// application
import getShopPageData from '~/store/shop/shopHelpers';
import ShopPageShop from '~/components/shop/ShopPageShop';
import { wrapper } from '~/store/store';

export const getServerSideProps = wrapper.getServerSideProps((store) => async (context) => {
    await getShopPageData(store, context);

    // Strip undefined values to prevent Next.js serialization errors
    const state = store.getState();
    const cleanState = JSON.parse(JSON.stringify(state));

    return { props: { initialState: cleanState } };
});

function Page() {
    return (
        <ShopPageShop
            layout="grid"
            gridLayout="grid-4-sidebar"
            sidebarPosition="start"
        />
    );
}

export default Page;
