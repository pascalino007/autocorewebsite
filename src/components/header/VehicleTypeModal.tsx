// react
import React from 'react';
// third-party
import { Modal } from 'reactstrap';
import { useRouter } from 'next/router';
// application
import { Cross12Svg } from '~/svg';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function VehicleTypeModal(props: Props) {
    const { isOpen, onClose } = props;
    const router = useRouter();

    const handleSelect = (type: 'car' | 'moto') => {
        onClose();
        if (type === 'car') {
            router.push('/');
        } else {
            router.push('/moto');
        }
    };

    return (
        <Modal isOpen={isOpen} toggle={onClose} centered className="vtm">
            <div className="vtm__body">
                <button type="button" className="vtm__close" onClick={onClose}>
                    <Cross12Svg />
                </button>

                {/* Decorative top bar */}
                <div className="vtm__accent" />

                <div className="vtm__header">
                    <div className="vtm__logo-icon">
                        <i className="fas fa-tools" />
                    </div>
                    <div className="vtm__title">
                        Choisissez votre véhicule
                    </div>
                    <div className="vtm__subtitle">
                        Sélectionnez le type de véhicule pour trouver les pièces compatibles
                    </div>
                </div>

                <div className="vtm__cards">
                    <button
                        type="button"
                        className="vtm__card vtm__card--car"
                        onClick={() => handleSelect('car')}
                    >
                        <div className="vtm__card-visual">
                            <div className="vtm__card-glow" />
                            <div className="vtm__card-icon-wrap">
                                <i className="fas fa-car-side" />
                            </div>
                        </div>
                        <div className="vtm__card-label">Automobile</div>
                        <div className="vtm__card-desc">
                            Pièces auto, SUV, utilitaires
                        </div>
                        <div className="vtm__card-cta">
                            Explorer
                            <i className="fas fa-arrow-right" />
                        </div>
                    </button>

                    <div className="vtm__divider">
                        <span>ou</span>
                    </div>

                    <button
                        type="button"
                        className="vtm__card vtm__card--moto"
                        onClick={() => handleSelect('moto')}
                    >
                        <div className="vtm__card-visual">
                            <div className="vtm__card-glow" />
                            <div className="vtm__card-icon-wrap">
                                <i className="fas fa-motorcycle" />
                            </div>
                        </div>
                        <div className="vtm__card-label">Moto</div>
                        <div className="vtm__card-desc">
                            Motos, scooters, quads
                        </div>
                        <div className="vtm__card-cta">
                            Explorer
                            <i className="fas fa-arrow-right" />
                        </div>
                    </button>
                </div>

                <div className="vtm__footer">
                    <i className="fas fa-shield-alt" />
                    Pièces certifiées &middot; Livraison rapide &middot; Retours gratuits
                </div>
            </div>
        </Modal>
    );
}

export default VehicleTypeModal;
