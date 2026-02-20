// react
import React from 'react';
// third-party
import { Modal } from 'reactstrap';
// application
import { Cross12Svg } from '~/svg';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function SellerModal(props: Props) {
    const { isOpen, onClose } = props;

    return (
        <Modal isOpen={isOpen} toggle={onClose} centered className="seller-modal">
            <div className="seller-modal__body">
                <button type="button" className="seller-modal__close" onClick={onClose}>
                    <Cross12Svg />
                </button>

                <div className="seller-modal__title">
                    Vendre sur Akodessewa.com
                </div>
                <div className="seller-modal__subtitle">
                    Comment souhaitez-vous continuer ?
                </div>

                <div className="seller-modal__options">
                    <a
                        href="https://wa.me/0022890171212?text=Bonjour%2C%20je%20souhaite%20vendre%20sur%20Akodessewa.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="seller-modal__option seller-modal__option--support"
                        onClick={onClose}
                    >
                        <div className="seller-modal__option-icon">
                            <i className="fab fa-whatsapp" />
                        </div>
                        <div className="seller-modal__option-info">
                            <div className="seller-modal__option-title">
                                Contacter le support
                            </div>
                            <div className="seller-modal__option-desc">
                                Discutez avec notre équipe via WhatsApp
                            </div>
                        </div>
                    </a>

                    <a
                        href="/account/login"
                        className="seller-modal__option seller-modal__option--register"
                        onClick={onClose}
                    >
                        <div className="seller-modal__option-icon">
                            <i className="fas fa-store" />
                        </div>
                        <div className="seller-modal__option-info">
                            <div className="seller-modal__option-title">
                                Inscription Fournisseur
                            </div>
                            <div className="seller-modal__option-desc">
                                Remplissez le formulaire d&apos;inscription fournisseur
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </Modal>
    );
}

export default SellerModal;
