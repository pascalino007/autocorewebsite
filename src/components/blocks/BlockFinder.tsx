// react
import React, { useState } from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';
// application
import Decor from '~/components/shared/Decor';
import VehicleSelect from '~/components/shared/VehicleSelect';
import { baseUrl } from '~/services/utils';
import { IVehicle } from '~/interfaces/vehicle';

type FinderTab = 'vehicle' | 'vin';

function BlockFinder() {
    const router = useRouter();
    const [vehicle, setVehicle] = useState<IVehicle | null>(null);
    const [activeTab, setActiveTab] = useState<FinderTab>('vehicle');
    const [vinInput, setVinInput] = useState('');

    const onSubmitVehicle = (event: React.FormEvent) => {
        event.preventDefault();

        if (!vehicle) {
            return;
        }

        router.push({
            pathname: '/vehicle-search',
            query: {
                vehicle_id: vehicle.id.toString(),
                year: vehicle.year.toString(),
                make: vehicle.make,
                model: vehicle.model,
                engine: vehicle.engine,
                filter_vehicle: vehicle.id.toString(),
            },
        }).then();
    };

    const onSubmitVin = (event: React.FormEvent) => {
        event.preventDefault();

        if (!vinInput.trim()) {
            return;
        }

        router.push({
            pathname: '/vehicle-search',
            query: { vin: vinInput.trim() },
        }).then();
    };

    return (
        <div className="block block-finder">
            <Decor className="block-finder__decor" type="bottom" />
            <div
                className="block-finder__image"
                style={{ backgroundImage: `url(${baseUrl('/images/finder.jpg')})` }}
            />
            <div className="block-finder__body container container--max--xl">
                <div className="block-finder__title">
                    <FormattedMessage id="TEXT_BLOCK_FINDER_TITLE" />
                </div>
                <div className="block-finder__subtitle">
                    <FormattedMessage id="TEXT_BLOCK_FINDER_SUBTITLE" />
                </div>

                {/* Tabs */}
                <div className="finder-tabs">
                    <button
                        type="button"
                        className={classNames('finder-tabs__tab', {
                            'finder-tabs__tab--active': activeTab === 'vehicle',
                        })}
                        onClick={() => setActiveTab('vehicle')}
                    >
                        <i className="fas fa-car" />
                        <span>S&eacute;lection v&eacute;hicule</span>
                    </button>
                    <button
                        type="button"
                        className={classNames('finder-tabs__tab', {
                            'finder-tabs__tab--active': activeTab === 'vin',
                        })}
                        onClick={() => setActiveTab('vin')}
                    >
                        <i className="fas fa-barcode" />
                        <span>Recherche par VIN</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="finder-tabs__content">
                    {activeTab === 'vehicle' && (
                        <form className="block-finder__form" onSubmit={onSubmitVehicle}>
                            <VehicleSelect className="block-finder__select" onVehicleChange={setVehicle} />

                            <button className="block-finder__button" type="submit">
                                <FormattedMessage id="BUTTON_BLOCK_FINDER_SEARCH" />
                            </button>
                        </form>
                    )}

                    {activeTab === 'vin' && (
                        <form className="finder-vin" onSubmit={onSubmitVin}>
                            <div className="finder-vin__desc">
                                <i className="fas fa-info-circle" />
                                <span>
                                    Le num&eacute;ro VIN (Vehicle Identification Number) se trouve sur la carte grise
                                    ou sur la plaque du chassis de votre v&eacute;hicule.
                                </span>
                            </div>
                            <div className="finder-vin__row">
                                <input
                                    type="text"
                                    className="finder-vin__input"
                                    placeholder="Entrez votre VIN (17 caractères)"
                                    value={vinInput}
                                    onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                                    maxLength={17}
                                />
                                <button type="submit" className="finder-vin__btn">
                                    <i className="fas fa-search" />
                                    <span>Rechercher</span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default React.memo(BlockFinder);
