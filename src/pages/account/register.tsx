// react
import React from 'react';
// third-party
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
// application
import AppLink from '~/components/shared/AppLink';
import BlockSpace from '~/components/blocks/BlockSpace';
import PageTitle from '~/components/shared/PageTitle';
import Redirect from '~/components/shared/Redirect';
import url from '~/services/url';
import { useSignUpForm } from '~/services/forms/sign-up';
import { useUser } from '~/store/user/userHooks';
import { validateEmail } from '~/services/validators';

function Page() {
    const intl = useIntl();
    const user = useUser();
    const signUpForm = useSignUpForm();

    if (user) {
        return <Redirect href={url.accountDashboard()} />;
    }

    return (
        <React.Fragment>
            <PageTitle>{intl.formatMessage({ id: 'HEADER_REGISTER' })}</PageTitle>

            <BlockSpace layout="after-header" />

            <div className="block">
                <div className="container container--max--lg">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 d-flex">
                            <div className="card flex-grow-1">
                                <div className="card-body card-body--padding--2">
                                    <h3 className="card-title">
                                        <FormattedMessage id="HEADER_REGISTER" />
                                    </h3>
                                    <form onSubmit={signUpForm.submit}>
                                        {signUpForm.serverError && (
                                            <div className="alert alert-sm alert-danger">
                                                <FormattedMessage id={signUpForm.serverError} />
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label htmlFor="signup-email">
                                                <FormattedMessage id="INPUT_EMAIL_ADDRESS_LABEL" />
                                            </label>
                                            <input
                                                id="signup-email"
                                                type="email"
                                                className={classNames('form-control', {
                                                    'is-invalid': signUpForm.errors.email,
                                                })}
                                                placeholder="customer@example.com"
                                                {...signUpForm.register('email', {
                                                    required: true,
                                                    validate: { email: validateEmail },
                                                })}
                                            />
                                            <div className="invalid-feedback">
                                                {signUpForm.errors.email?.type === 'required' && (
                                                    <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                                )}
                                                {signUpForm.errors.email?.type === 'email' && (
                                                    <FormattedMessage id="ERROR_FORM_INCORRECT_EMAIL" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="signup-password">
                                                <FormattedMessage id="INPUT_PASSWORD_LABEL" />
                                            </label>
                                            <input
                                                id="signup-password"
                                                type="password"
                                                className={classNames('form-control', {
                                                    'is-invalid': signUpForm.errors.password,
                                                })}
                                                placeholder={intl.formatMessage({ id: 'INPUT_PASSWORD_PLACEHOLDER' })}
                                                {...signUpForm.register('password', { required: true })}
                                            />
                                            <div className="invalid-feedback">
                                                {signUpForm.errors.password?.type === 'required' && (
                                                    <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="signup-confirm">
                                                <FormattedMessage id="INPUT_PASSWORD_REPEAT_LABEL" />
                                            </label>
                                            <input
                                                id="signup-confirm"
                                                type="password"
                                                className={classNames('form-control', {
                                                    'is-invalid': signUpForm.errors.confirmPassword,
                                                })}
                                                placeholder={intl.formatMessage({ id: 'INPUT_PASSWORD_REPEAT_PLACEHOLDER' })}
                                                {...signUpForm.register('confirmPassword', {
                                                    required: true,
                                                    validate: {
                                                        match: (value) => value === signUpForm.watch('password'),
                                                    },
                                                })}
                                            />
                                            <div className="invalid-feedback">
                                                {signUpForm.errors.confirmPassword?.type === 'required' && (
                                                    <FormattedMessage id="ERROR_FORM_REQUIRED" />
                                                )}
                                                {signUpForm.errors.confirmPassword?.type === 'match' && (
                                                    <FormattedMessage id="ERROR_FORM_PASSWORD_DOES_NOT_MATCH" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="form-group mb-0 d-flex align-items-center justify-content-between flex-wrap">
                                            <button
                                                type="submit"
                                                className={classNames('btn', 'btn-primary', 'mt-3', {
                                                    'btn-loading': signUpForm.submitInProgress,
                                                })}
                                            >
                                                <FormattedMessage id="BUTTON_REGISTER" />
                                            </button>
                                            <AppLink href={url.signIn()} className="mt-3">
                                                <FormattedMessage id="HEADER_LOGIN" />
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
