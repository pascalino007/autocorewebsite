// react
import React, { useState } from 'react';
// third-party
import Head from 'next/head';
// application
import BlockSpace from '~/components/blocks/BlockSpace';
import AppLink from '~/components/shared/AppLink';
import url from '~/services/url';

type Step = 'email' | 'otp' | 'reset' | 'success';

function ForgotPasswordPage() {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !email.includes('@')) {
            setError('Veuillez entrer une adresse email valide.');
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep('otp');
        }, 1500);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Veuillez entrer le code a 6 chiffres.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('reset');
        }, 1500);
    };

    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('success');
        }, 1500);
    };

    const resendOtp = () => {
        setOtp(['', '', '', '', '', '']);
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <React.Fragment>
            <Head>
                <title>Recuperation de mot de passe — Akodessewa.com</title>
            </Head>

            <div className="forgot-password-page">
                <div className="forgot-password-page__card">
                    {/* Progress Steps */}
                    <div className="forgot-password-page__progress">
                        {['email', 'otp', 'reset', 'success'].map((s, i) => (
                            <div
                                key={s}
                                className={`forgot-password-page__step ${
                                    ['email', 'otp', 'reset', 'success'].indexOf(step) >= i
                                        ? 'forgot-password-page__step--active'
                                        : ''
                                } ${
                                    ['email', 'otp', 'reset', 'success'].indexOf(step) > i
                                        ? 'forgot-password-page__step--done'
                                        : ''
                                }`}
                            >
                                <div className="forgot-password-page__step-dot">
                                    {['email', 'otp', 'reset', 'success'].indexOf(step) > i
                                        ? <i className="fas fa-check" />
                                        : i + 1}
                                </div>
                                <span className="forgot-password-page__step-label">
                                    {['Email', 'Verification', 'Nouveau', 'Termine'][i]}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="forgot-password-page__form">
                            <div className="forgot-password-page__icon-wrap">
                                <i className="fas fa-lock" />
                            </div>
                            <h2 className="forgot-password-page__title">Mot de passe oublie ?</h2>
                            <p className="forgot-password-page__desc">
                                Entrez votre adresse email et nous vous enverrons un code de verification.
                            </p>
                            {error && <div className="forgot-password-page__error">{error}</div>}
                            <div className="forgot-password-page__field">
                                <label htmlFor="fp-email">Adresse email</label>
                                <div className="forgot-password-page__input-wrap">
                                    <i className="fas fa-envelope" />
                                    <input
                                        id="fp-email"
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <button type="submit" className="forgot-password-page__btn" disabled={loading}>
                                {loading ? (
                                    <><i className="fas fa-spinner fa-spin" /> Envoi en cours...</>
                                ) : (
                                    <>Envoyer le code <i className="fas fa-arrow-right" /></>
                                )}
                            </button>
                            <AppLink href={url.signIn()} className="forgot-password-page__back-link">
                                <i className="fas fa-arrow-left" /> Retour a la connexion
                            </AppLink>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === 'otp' && (
                        <form onSubmit={handleOtpSubmit} className="forgot-password-page__form">
                            <div className="forgot-password-page__icon-wrap forgot-password-page__icon-wrap--blue">
                                <i className="fas fa-shield-alt" />
                            </div>
                            <h2 className="forgot-password-page__title">Verification</h2>
                            <p className="forgot-password-page__desc">
                                Nous avons envoye un code a 6 chiffres a <strong>{email}</strong>
                            </p>
                            {error && <div className="forgot-password-page__error">{error}</div>}
                            <div className="forgot-password-page__otp-row">
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        id={`otp-${idx}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="forgot-password-page__otp-input"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(idx, e.target.value.replace(/\D/, ''))}
                                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                        autoFocus={idx === 0}
                                    />
                                ))}
                            </div>
                            <button type="submit" className="forgot-password-page__btn" disabled={loading}>
                                {loading ? (
                                    <><i className="fas fa-spinner fa-spin" /> Verification...</>
                                ) : (
                                    <>Verifier le code <i className="fas fa-arrow-right" /></>
                                )}
                            </button>
                            <button type="button" className="forgot-password-page__resend" onClick={resendOtp} disabled={loading}>
                                <i className="fas fa-redo" /> Renvoyer le code
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 'reset' && (
                        <form onSubmit={handleResetSubmit} className="forgot-password-page__form">
                            <div className="forgot-password-page__icon-wrap forgot-password-page__icon-wrap--green">
                                <i className="fas fa-key" />
                            </div>
                            <h2 className="forgot-password-page__title">Nouveau mot de passe</h2>
                            <p className="forgot-password-page__desc">
                                Choisissez un nouveau mot de passe securise pour votre compte.
                            </p>
                            {error && <div className="forgot-password-page__error">{error}</div>}
                            <div className="forgot-password-page__field">
                                <label htmlFor="fp-password">Nouveau mot de passe</label>
                                <div className="forgot-password-page__input-wrap">
                                    <i className="fas fa-lock" />
                                    <input
                                        id="fp-password"
                                        type="password"
                                        placeholder="Minimum 6 caracteres"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="forgot-password-page__field">
                                <label htmlFor="fp-confirm">Confirmer le mot de passe</label>
                                <div className="forgot-password-page__input-wrap">
                                    <i className="fas fa-lock" />
                                    <input
                                        id="fp-confirm"
                                        type="password"
                                        placeholder="Retapez le mot de passe"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="forgot-password-page__btn" disabled={loading}>
                                {loading ? (
                                    <><i className="fas fa-spinner fa-spin" /> Reinitialisation...</>
                                ) : (
                                    <>Reinitialiser <i className="fas fa-check" /></>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === 'success' && (
                        <div className="forgot-password-page__form forgot-password-page__form--success">
                            <div className="forgot-password-page__success-icon">
                                <i className="fas fa-check-circle" />
                            </div>
                            <h2 className="forgot-password-page__title">Mot de passe reinitialise !</h2>
                            <p className="forgot-password-page__desc">
                                Votre mot de passe a ete change avec succes. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                            </p>
                            <AppLink href={url.signIn()} className="forgot-password-page__btn">
                                <i className="fas fa-sign-in-alt" /> Se connecter
                            </AppLink>
                        </div>
                    )}
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export default ForgotPasswordPage;
