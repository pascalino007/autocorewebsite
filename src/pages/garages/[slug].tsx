// react
import React, { useState } from 'react';
// third-party
import Head from 'next/head';
import { GetServerSideProps } from 'next';
// application
import BlockSpace from '~/components/blocks/BlockSpace';
import AppLink from '~/components/shared/AppLink';
import garages, { IGarage } from '~/data/garages';

interface Props {
    garage: IGarage;
}

function GarageProfilePage({ garage }: Props) {
    const [activeImageIdx, setActiveImageIdx] = useState(0);

    // Mock services data
    const services = [
        { icon: 'fas fa-wrench', name: 'Mecanique Generale', description: 'Reparation et entretien complet de votre vehicule' },
        { icon: 'fas fa-cog', name: 'Diagnostic Electronique', description: 'Analyse complete avec equipement de pointe' },
        { icon: 'fas fa-oil-can', name: 'Vidange & Filtres', description: 'Changement d\'huile et de filtres toutes marques' },
        { icon: 'fas fa-car-crash', name: 'Carrosserie', description: 'Reparation de carrosserie et peinture' },
        { icon: 'fas fa-snowflake', name: 'Climatisation', description: 'Recharge et reparation de climatisation' },
        { icon: 'fas fa-battery-full', name: 'Electricite Auto', description: 'Batterie, alternateur, demarreur' },
    ];

    // Mock reviews
    const reviews = [
        { id: 1, name: 'Kofi A.', rating: 5, date: '15 Jan 2024', text: 'Excellent service, tres professionnel. Mon vehicule a ete repare rapidement et a un prix raisonnable.' },
        { id: 2, name: 'Ama D.', rating: 4, date: '8 Dec 2023', text: 'Bon garage, equipe sympathique. Je recommande pour la mecanique generale.' },
        { id: 3, name: 'Yao K.', rating: 5, date: '22 Nov 2023', text: 'Le meilleur garage de la ville ! Service rapide et de qualite.' },
    ];

    // Create placeholder workspace images if none
    const workspaceImgs = garage.workspaceImages.length > 0
        ? garage.workspaceImages
        : [garage.image, garage.image];

    return (
        <React.Fragment>
            <Head>
                <title>{garage.name} — Garages Partenaires — Akodessewa.com</title>
            </Head>

            <div className="garage-profile">
                {/* Hero Banner */}
                <div className="garage-profile__hero">
                    <div
                        className="garage-profile__hero-bg"
                        style={{
                            backgroundImage: `url(${garage.bannerImage})`,
                        }}
                    />
                    <div className="garage-profile__hero-overlay" />
                    <div className="garage-profile__hero-content">
                        <div className="container">
                            <div className="garage-profile__hero-layout">
                                <div className="garage-profile__avatar-wrap">
                                    <img
                                        src={garage.image}
                                        alt={garage.name}
                                        className="garage-profile__avatar"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(garage.name)}&size=200&background=d32f2f&color=fff&font-size=0.3`;
                                        }}
                                    />
                                    {garage.tier === 'vip' && (
                                        <div className="garage-profile__vip-badge">
                                            <i className="fas fa-crown" /> VIP
                                        </div>
                                    )}
                                </div>
                                <div className="garage-profile__hero-info">
                                    <h1 className="garage-profile__name">{garage.name}</h1>
                                    <div className="garage-profile__hero-location">
                                        <i className="fas fa-map-marker-alt" />
                                        <span>{garage.address}, {garage.city}, {garage.country}</span>
                                    </div>
                                    <div className="garage-profile__hero-rating">
                                        <div className="garage-profile__stars">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <i key={star} className={`fa-star ${star <= Math.round(garage.rating) ? 'fas' : 'far'}`} />
                                            ))}
                                        </div>
                                        <span>{garage.rating} ({garage.reviewCount} avis)</span>
                                    </div>
                                    <div className="garage-profile__hero-tags">
                                        {garage.specialty.map((spec) => (
                                            <span key={spec} className="garage-profile__tag">{spec}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="garage-profile__hero-actions">
                                    <a href={`tel:${garage.phone}`} className="garage-profile__action-btn garage-profile__action-btn--primary">
                                        <i className="fas fa-phone" />
                                        <span>Appeler</span>
                                    </a>
                                    <a
                                        href={`https://wa.me/${garage.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="garage-profile__action-btn garage-profile__action-btn--whatsapp"
                                    >
                                        <i className="fab fa-whatsapp" />
                                        <span>WhatsApp</span>
                                    </a>
                                    <a href={`mailto:${garage.email}`} className="garage-profile__action-btn garage-profile__action-btn--outline">
                                        <i className="fas fa-envelope" />
                                        <span>Email</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="garage-profile__body">
                        {/* Main Content */}
                        <div className="garage-profile__main">
                            {/* About Section */}
                            <div className="garage-profile__section">
                                <h2 className="garage-profile__section-title">
                                    <i className="fas fa-info-circle" />
                                    A propos
                                </h2>
                                <p className="garage-profile__description">{garage.longDescription}</p>
                            </div>

                            {/* Services Section */}
                            <div className="garage-profile__section">
                                <h2 className="garage-profile__section-title">
                                    <i className="fas fa-tools" />
                                    Nos Services
                                </h2>
                                <div className="garage-profile__services-grid">
                                    {services.map((service) => (
                                        <div key={service.name} className="garage-profile__service-card">
                                            <div className="garage-profile__service-icon">
                                                <i className={service.icon} />
                                            </div>
                                            <div className="garage-profile__service-info">
                                                <h4>{service.name}</h4>
                                                <p>{service.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Workspace Gallery */}
                            <div className="garage-profile__section">
                                <h2 className="garage-profile__section-title">
                                    <i className="fas fa-images" />
                                    Notre Atelier
                                </h2>
                                <div className="garage-profile__gallery">
                                    <div className="garage-profile__gallery-main">
                                        <img
                                            src={workspaceImgs[activeImageIdx] || garage.image}
                                            alt={`${garage.name} workspace`}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://placehold.co/800x500/d32f2f/white?text=${encodeURIComponent(garage.name)}`;
                                            }}
                                        />
                                    </div>
                                    {workspaceImgs.length > 1 && (
                                        <div className="garage-profile__gallery-thumbs">
                                            {workspaceImgs.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    className={`garage-profile__gallery-thumb ${idx === activeImageIdx ? 'garage-profile__gallery-thumb--active' : ''}`}
                                                    onClick={() => setActiveImageIdx(idx)}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`workspace ${idx + 1}`}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = `https://placehold.co/150x100/d32f2f/white?text=${idx + 1}`;
                                                        }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="garage-profile__section">
                                <h2 className="garage-profile__section-title">
                                    <i className="fas fa-comments" />
                                    Avis Clients
                                </h2>
                                <div className="garage-profile__reviews">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="garage-profile__review">
                                            <div className="garage-profile__review-header">
                                                <div className="garage-profile__review-avatar">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div className="garage-profile__review-meta">
                                                    <strong>{review.name}</strong>
                                                    <div className="garage-profile__review-stars">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <i key={star} className={`fa-star ${star <= review.rating ? 'fas' : 'far'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="garage-profile__review-date">{review.date}</span>
                                            </div>
                                            <p className="garage-profile__review-text">{review.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="garage-profile__sidebar">
                            {/* Quick Info Card */}
                            <div className="garage-profile__info-card">
                                <h3 className="garage-profile__info-card-title">Informations</h3>
                                <div className="garage-profile__info-item">
                                    <i className="fas fa-map-marker-alt" />
                                    <div>
                                        <strong>Adresse</strong>
                                        <span>{garage.address}, {garage.city}, {garage.country}</span>
                                    </div>
                                </div>
                                <div className="garage-profile__info-item">
                                    <i className="fas fa-phone" />
                                    <div>
                                        <strong>Telephone</strong>
                                        <a href={`tel:${garage.phone}`}>{garage.phone}</a>
                                    </div>
                                </div>
                                <div className="garage-profile__info-item">
                                    <i className="fas fa-envelope" />
                                    <div>
                                        <strong>Email</strong>
                                        <a href={`mailto:${garage.email}`}>{garage.email}</a>
                                    </div>
                                </div>
                                <div className="garage-profile__info-item">
                                    <i className="fas fa-clock" />
                                    <div>
                                        <strong>Horaires</strong>
                                        <span>{garage.openHours}</span>
                                    </div>
                                </div>
                                <div className="garage-profile__info-item">
                                    <i className="fas fa-award" />
                                    <div>
                                        <strong>Experience</strong>
                                        <span>{garage.yearsInBusiness} ans d&apos;activite</span>
                                    </div>
                                </div>
                            </div>

                            {/* Map placeholder */}
                            <div className="garage-profile__map-card">
                                <h3 className="garage-profile__info-card-title">Localisation</h3>
                                <div className="garage-profile__map-placeholder">
                                    <iframe
                                        title="Garage Location"
                                        width="100%"
                                        height="250"
                                        frameBorder="0"
                                        style={{ border: 0, borderRadius: '8px' }}
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${garage.longitude - 0.01}%2C${garage.latitude - 0.01}%2C${garage.longitude + 0.01}%2C${garage.latitude + 0.01}&layer=mapnik&marker=${garage.latitude}%2C${garage.longitude}`}
                                        allowFullScreen
                                    />
                                </div>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${garage.latitude},${garage.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="garage-profile__directions-btn"
                                >
                                    <i className="fas fa-directions" />
                                    Obtenir l&apos;itineraire
                                </a>
                            </div>

                            {/* Contact CTA */}
                            <div className="garage-profile__contact-cta">
                                <h3>Besoin d&apos;un devis ?</h3>
                                <p>Contactez ce garage directement pour obtenir un devis gratuit.</p>
                                <a
                                    href={`https://wa.me/${garage.whatsapp}?text=Bonjour ${garage.name}, je souhaite obtenir un devis via Akodessewa.com`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="garage-profile__whatsapp-cta"
                                >
                                    <i className="fab fa-whatsapp" />
                                    Demander un devis sur WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BlockSpace layout="before-footer" />
        </React.Fragment>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
    const garage = garages.find((g) => g.slug === slug as string);

    if (!garage) {
        return { notFound: true };
    }

    return { props: { garage } };
};

export default GarageProfilePage;
