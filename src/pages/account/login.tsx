// react
import React from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AppLink from '~/components/shared/AppLink';
import BlockSpace from '~/components/blocks/BlockSpace';
import Checkbox from '~/components/shared/Checkbox';
import PageTitle from '~/components/shared/PageTitle';
import Redirect from '~/components/shared/Redirect';
import url from '~/services/url';
import { useSignInForm } from '~/services/forms/sign-in';
import { useUser } from '~/store/user/userHooks';
import { validateEmail } from '~/services/validators';

function Page() {
    const intl = useIntl();
    const user = useUser();
    const signInForm = useSignInForm();

    if (user) {
        return <Redirect href={url.accountDashboard()} />;
    }

    const { ref: signInFormRememberMeRef, ...signInFormRememberMeRefProps } = signInForm.register('remember');

    return (
        <React.Fragment>
            <PageTitle>{intl.formatMessage({ id: 'HEADER_LOGIN' })}</PageTitle>

            <BlockSpace layout="after-header" />

            <div className="block">
                <div className="container container--max--lg">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 d-flex">
                            <div className="card flex-grow-1">
                                <div className="card-body card-body--padding--2">
                                    <h3 className="card-title">
                                        <FormattedMessage id="HEADER_LOGIN" />
                                    </h3>
                                    <form onSubmit={signInForm.submit}>
                                        {signInForm.serverError && (
                                            <div className="alert alert-sm alert-danger">
                                                <FormattedMessage id={signInForm.serverError} />
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label htmlFor="signin-email">
                                                <FormattedMessage id="INPUT_EMAIL_ADDRESS_LABEL" />
                                            </label>
                                            <input
                                                id="signin-email"
                                                type="email"
                                                className={classNames('form-control', {
                                                    'is-invalid': signInForm.errors.email,
                                                })}
                                                placeholder="customer@example.com"
                                                {...signInForm.register('email', {
                                                    required: true,
                                                    validate: { email: validateEmail },
                                                })}
                                            />
                                            <div className="invalid-feedback">
                                                {signInForm.errors.email?.type === 'required' && (
                                                    <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                                )}
                                                {signInForm.errors.email?.type === 'email' && (
                                                    <FormattedMessage id="ERROR_FORM_INCORRECT_EMAIL" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="signin-password">
                                                <FormattedMessage id="INPUT_PASSWORD_LABEL" />
                                            </label>
                                            <input
                                                id="signin-password"
                                                type="password"
                                                className={classNames('form-control', {
                                                    'is-invalid': signInForm.errors.password,
                                                })}
                                                placeholder={intl.formatMessage({ id: 'INPUT_PASSWORD_PLACEHOLDER' })}
                                                {...signInForm.register('password', { required: true })}
                                            />
                                            <div className="invalid-feedback">
                                                {signInForm.errors.password?.type === 'required' && (
                                                    <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                                )}
                                            </div>
                                            <small className="form-text text-muted">
                                                <AppLink href="/">
                                                    <FormattedMessage id="LINK_FORGOT_PASSWORD" />
                                                </AppLink>
                                            </small>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-check">
                                                <Checkbox
                                                    className="form-check-input"
                                                    id="sign-in-remember"
                                                    inputRef={signInFormRememberMeRef}
                                                    {...signInFormRememberMeRefProps}
                                                />
                                                <label className="form-check-label" htmlFor="sign-in-remember">
                                                    <FormattedMessage id="INPUT_REMEMBER_ME_LABEL" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group mb-0 d-flex align-items-center justify-content-between flex-wrap">
                                            <button
                                                type="submit"
                                                className={classNames('btn', 'btn-primary', 'mt-3', {
                                                    'btn-loading': signInForm.submitInProgress,
                                                })}
                                            >
                                                <FormattedMessage id="BUTTON_LOGIN" />
                                            </button>
                                            <AppLink href={url.signUp()} className="mt-3">
                                                <FormattedMessage id="LINK_CREATE_ACCOUNT" />
                                            </AppLink>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default Page;
