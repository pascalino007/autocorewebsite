// react
import React from 'react';
// application
import BlockHeader from '~/components/blocks/BlockHeader';
import BlockSpace from '~/components/blocks/BlockSpace';
import BlockUsedVehicles from '~/components/blocks/BlockUsedVehicles';
import PageTitle from '~/components/shared/PageTitle';
import usedVehicles from '~/data/usedVehicles';
import url from '~/services/url';

function Page() {
    const motos = usedVehicles.filter((vehicle) => vehicle.type === 'moto');

    return (
        <React.Fragment>
            <PageTitle>Used Motorcycles</PageTitle>

            <BlockHeader
                pageTitle="Used Motorcycles"
                breadcrumb={[
                    { title: 'Home', url: url.home() },
                    { title: 'Used Vehicles', url: url.usedVehicles() },
                    { title: 'Used Motorcycles', url: url.usedMoto() },
                ]}
            />

            <BlockUsedVehicles
                title="Available Used Motorcycles"
                vehicles={motos}
                viewAllHref={url.usedVehicles()}
            />

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
