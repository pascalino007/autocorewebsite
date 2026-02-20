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
    const cars = usedVehicles.filter((vehicle) => vehicle.type === 'car');

    return (
        <React.Fragment>
            <PageTitle>Used Cars</PageTitle>

            <BlockHeader
                pageTitle="Used Cars"
                breadcrumb={[
                    { title: 'Home', url: url.home() },
                    { title: 'Used Vehicles', url: url.usedVehicles() },
                    { title: 'Used Cars', url: url.usedCars() },
                ]}
            />

            <BlockUsedVehicles
                title="Available Used Cars"
                vehicles={cars}
                viewAllHref={url.usedVehicles()}
            />

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
