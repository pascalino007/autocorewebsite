// react
import React from 'react';
// application
import AppLink from '~/components/shared/AppLink';
import VehicleCard from '~/components/shared/VehicleCard';
import { IUsedVehicle } from '~/data/usedVehicles';

interface Props {
    title: string;
    vehicles: IUsedVehicle[];
    viewAllHref?: string;
}

function BlockUsedVehicles(props: Props) {
    const { title, vehicles, viewAllHref } = props;

    return (
        <div className="block block-used-vehicles">
            <div className="container">
                <div className="block-used-vehicles__header">
                    <h3 className="block-used-vehicles__title">{title}</h3>
                    {viewAllHref && (
                        <AppLink href={viewAllHref} className="block-used-vehicles__viewall">
                            Voir tout
                            <i className="fas fa-arrow-right" />
                        </AppLink>
                    )}
                </div>
                <div className="block-used-vehicles__grid">
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockUsedVehicles);
