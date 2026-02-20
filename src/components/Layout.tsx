// react
import React, { PropsWithChildren, useState } from 'react';
// third-party
import classNames from 'classnames';
import { ToastContainer } from 'react-toastify';
// application
import Footer from '~/components/footer/Footer';
import Header from '~/components/header/Header';
import MobileHeader from '~/components/mobile/MobileHeader';
import MobileMenu from '~/components/mobile/MobileMenu';
import Quickview from '~/components/shared/Quickview';
import { useOptions } from '~/store/options/optionsHooks';

interface Props extends PropsWithChildren<{}>{ }

function Layout(props: Props) {
    const { children } = props;
    const { desktopHeaderLayout, desktopHeaderScheme, mobileHeaderVariant } = useOptions();
    const desktopVariantClass = `${desktopHeaderLayout}-${desktopHeaderScheme}`;
    const mobileVariantClass = `mobile-${mobileHeaderVariant}`;
    const [bannerVisible, setBannerVisible] = useState(true);

    const classes = classNames(
        'site',
        `site--desktop-header--${desktopVariantClass}`,
        `site--mobile-header--${mobileVariantClass}`,
    );

    return (
        <div className={classes}>
            <ToastContainer autoClose={5000} hideProgressBar />

            {/* Welcome Banner */}
            {bannerVisible && (
                <div className="welcome-banner">
                    <div className="welcome-banner__inner">
                        <div className="welcome-banner__content">
                            <i className="fas fa-bolt welcome-banner__icon" />
                            <span className="welcome-banner__text">
                                Bienvenue sur <strong>Akodessewa.com</strong> &mdash; La 1&egrave;re marketplace de pi&egrave;ces auto & moto en Afrique de l&rsquo;Ouest
                            </span>
                            <span className="welcome-banner__cta">Livraison rapide &bull; Paiement s&eacute;curis&eacute;</span>
                        </div>
                        <button
                            type="button"
                            className="welcome-banner__close"
                            onClick={() => setBannerVisible(false)}
                            aria-label="Fermer"
                        >
                            <i className="fas fa-times" />
                        </button>
                    </div>
                </div>
            )}

            <div className="site__container">
                <header className="site__mobile-header">
                    <MobileHeader />
                </header>

                <header className="site__header">
                    <Header />
                </header>

                <div className="site__body">
                    {children}
                </div>

                <footer className="site__footer">
                    <Footer />
                </footer>
            </div>

            <MobileMenu />

            <Quickview />
        </div>
    );
}

export default Layout;
