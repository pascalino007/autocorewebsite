// react
import React from 'react';
// third-party
import { FormattedMessage } from 'react-intl';
// application
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

interface Props extends React.HTMLAttributes<HTMLElement> {}

function Logo(props: Props) {
    return (
        <div {...props}>
            <AppLink href={url.home()} className="logo">
                <div className="logo__slogan">
                    <FormattedMessage id="TEXT_SLOGAN" />
                </div>
                <div className="logo__image">
                    {/* logo */}
                    <span className="logo__text">
                        <span className="logo__part-primary">Akodessewa</span>
                        <span className="logo__part-secondary">.com</span>
                    </span>
                    {/* logo / end */}
                </div>
            </AppLink>
        </div>
    );
}

export default Logo;
