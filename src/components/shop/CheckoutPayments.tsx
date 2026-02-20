// react
import React, { useMemo } from 'react';
// third-party
import { useFormContext } from 'react-hook-form';
import { useIntl } from 'react-intl';
// application
import AppImage from '~/components/shared/AppImage';
import Collapse from '~/components/shared/Collapse';
import RadioButton from '~/components/shared/RadioButton';

function CheckoutPayments() {
    const intl = useIntl();
    const { register, watch } = useFormContext();
    const currentPayment = watch('payment');
    const payments = useMemo(() => [
        {
            name: 'mobile_money',
            label: 'Mobile Money',
            description: 'Paiement via Mixx by Yas ou Moov Money.',
            logos: [
                { src: '/images/payments/mixx-yas.svg', alt: 'Mixx by Yas' },
                { src: '/images/payments/moov-money.svg', alt: 'Moov Money' },
            ],
        },
        {
            name: 'card',
            label: 'Carte Bancaire',
            description: 'Paiement sécurisé par carte Visa / Mastercard.',
            logos: [
                { src: '/images/payments/card-visa-master.svg', alt: 'Carte bancaire' },
            ],
        },
        {
            name: 'bank',
            label: intl.formatMessage({ id: 'TEXT_PAYMENT_BANK_LABEL' }),
            description: intl.formatMessage({ id: 'TEXT_PAYMENT_BANK_DESCRIPTION' }),
        },
    ], [intl]);

    const { ref: paymentRadioRef, ...paymentRadioProps } = register('payment');

    return (
        <div className="checkout__payment-methods payment-methods">
            <ul className="payment-methods__list">
                {payments.map((payment, paymentIndex) => (
                    <Collapse<HTMLLIElement, HTMLDivElement>
                        key={paymentIndex}
                        open={currentPayment === payment.name}
                        toggleClass="payment-methods__item--active"
                        render={({ setItemRef, setContentRef }) => (
                            <li className="payment-methods__item" ref={setItemRef}>
                                <label className="payment-methods__item-header">
                                    <RadioButton
                                        value={payment.name}
                                        className="payment-methods__item-radio"
                                        inputRef={paymentRadioRef}
                                        {...paymentRadioProps}
                                    />
                                    <span className="payment-methods__item-title">
                                        {payment.label}
                                    </span>
                                </label>
                                <div className="payment-methods__item-container" ref={setContentRef}>
                                    <div className="payment-methods__item-details text-muted">
                                        {payment.description}
                                        {'logos' in payment && Array.isArray(payment.logos) && payment.logos.length > 0 && (
                                            <div className="payment-methods__brand-logos">
                                                {payment.logos.map((logo, idx) => (
                                                    <span key={idx} className="payment-methods__brand-logo">
                                                        <AppImage src={logo.src} alt={logo.alt} />
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        )}
                    />
                ))}
            </ul>
        </div>
    );
}

export default CheckoutPayments;
