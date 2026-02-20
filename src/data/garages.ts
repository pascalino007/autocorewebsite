export interface IGarage {
    id: number;
    slug: string;
    name: string;
    tier: 'normal' | 'vip';
    specialty: string[];
    description: string;
    longDescription: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    image: string;
    bannerImage: string;
    workspaceImages: string[];
    rating: number;
    reviewCount: number;
    yearsInBusiness: number;
    openHours: string;
}

const garages: IGarage[] = [
    {
        id: 1,
        slug: 'garage-express-lome',
        name: 'Garage Express Lome',
        tier: 'vip',
        specialty: ['Mecanique generale', 'Diagnostic electronique', 'Climatisation'],
        description: 'Le garage de reference a Lome pour l\'entretien et la reparation de tous types de vehicules.',
        longDescription: 'Garage Express Lome est un atelier certifie offrant des services de mecanique generale, diagnostic electronique avance et reparation de climatisation automobile. Avec plus de 12 ans d\'experience, notre equipe de techniciens qualifies garantit un travail de qualite sur toutes les marques. Nous utilisons des equipements de derniere generation pour un diagnostic precis et rapide.',
        phone: '+228 90 11 22 33',
        whatsapp: '+22890112233',
        email: 'contact@garageexpress.tg',
        address: '25 Boulevard du 13 Janvier, Tokoin',
        city: 'Lome',
        country: 'Togo',
        latitude: 6.1725,
        longitude: 1.2314,
        image: '/images/garages/garage-express.jpg',
        bannerImage: '/images/garages/garage-express-banner.jpg',
        workspaceImages: ['/images/garages/workspace-1.jpg', '/images/garages/workspace-2.jpg', '/images/garages/workspace-3.jpg'],
        rating: 4.8,
        reviewCount: 124,
        yearsInBusiness: 12,
        openHours: 'Lun-Sam: 7h30 - 18h00',
    },
    {
        id: 2,
        slug: 'auto-service-premium',
        name: 'Auto Service Premium',
        tier: 'vip',
        specialty: ['Carrosserie', 'Peinture', 'Debosselage'],
        description: 'Specialiste en carrosserie et peinture automobile, finitions haut de gamme.',
        longDescription: 'Auto Service Premium est le leader en carrosserie automobile au Togo. Nous offrons des services de reparation de carrosserie, peinture complete ou partielle, debosselage sans peinture et traitement ceramique. Chaque vehicule est traite avec le plus grand soin dans notre cabine de peinture professionnelle.',
        phone: '+228 91 22 33 44',
        whatsapp: '+22891223344',
        email: 'info@autoservicepremium.tg',
        address: '8 Rue de la Gare, Adidogome',
        city: 'Lome',
        country: 'Togo',
        latitude: 6.1856,
        longitude: 1.1872,
        image: '/images/garages/auto-service.jpg',
        bannerImage: '/images/garages/auto-service-banner.jpg',
        workspaceImages: ['/images/garages/workspace-4.jpg', '/images/garages/workspace-5.jpg'],
        rating: 4.6,
        reviewCount: 89,
        yearsInBusiness: 8,
        openHours: 'Lun-Ven: 8h00 - 17h30',
    },
    {
        id: 3,
        slug: 'moto-clinic-kpalime',
        name: 'Moto Clinic Kpalime',
        tier: 'normal',
        specialty: ['Reparation moto', 'Vidange', 'Pieces detachees moto'],
        description: 'Votre specialiste moto a Kpalime, entretien et reparation de toutes marques.',
        longDescription: 'Moto Clinic est le garage de reference pour les motos a Kpalime. Nous reparons toutes les marques: Honda, Yamaha, Suzuki, Haojue, Apsonic et bien d\'autres. Services de vidange, changement de freins, reglage moteur et vente de pieces detachees.',
        phone: '+228 92 33 44 55',
        whatsapp: '+22892334455',
        email: 'motoclinic@email.com',
        address: '15 Avenue de la Liberation',
        city: 'Kpalime',
        country: 'Togo',
        latitude: 6.9001,
        longitude: 0.6334,
        image: '/images/garages/moto-clinic.jpg',
        bannerImage: '/images/garages/moto-clinic-banner.jpg',
        workspaceImages: ['/images/garages/workspace-6.jpg'],
        rating: 4.3,
        reviewCount: 45,
        yearsInBusiness: 5,
        openHours: 'Lun-Sam: 7h00 - 18h00',
    },
    {
        id: 4,
        slug: 'fast-fix-garage',
        name: 'Fast Fix Garage',
        tier: 'normal',
        specialty: ['Electricite auto', 'Batterie', 'Demarrage'],
        description: 'Expert en electricite automobile et systemes de demarrage.',
        longDescription: 'Fast Fix Garage est specialise dans le diagnostic et la reparation des systemes electriques automobiles. Alternateur, demarreur, batterie, eclairage, cablage — nous resolvons tous vos problemes electriques rapidement.',
        phone: '+228 93 44 55 66',
        whatsapp: '+22893445566',
        email: 'fastfix@email.com',
        address: '3 Rue du Commerce',
        city: 'Lome',
        country: 'Togo',
        latitude: 6.1319,
        longitude: 1.2228,
        image: '/images/garages/fast-fix.jpg',
        bannerImage: '/images/garages/fast-fix-banner.jpg',
        workspaceImages: [],
        rating: 4.1,
        reviewCount: 32,
        yearsInBusiness: 3,
        openHours: 'Lun-Sam: 8h00 - 17h00',
    },
    {
        id: 5,
        slug: 'golden-wrench-accra',
        name: 'Golden Wrench Accra',
        tier: 'vip',
        specialty: ['Mecanique generale', 'Transmission', 'Suspension'],
        description: 'Garage VIP a Accra pour reparations mecaniques haut de gamme.',
        longDescription: 'Golden Wrench est un garage premium a Accra, Ghana. Nous sommes specialises dans la reparation de transmissions, suspensions et mecanique generale pour vehicules europeens et asiatiques. Notre equipe est formee aux derniers standards internationaux.',
        phone: '+233 20 123 4567',
        whatsapp: '+233201234567',
        email: 'info@goldenwrench.gh',
        address: '22 Oxford Street, Osu',
        city: 'Accra',
        country: 'Ghana',
        latitude: 5.5560,
        longitude: -0.1869,
        image: '/images/garages/golden-wrench.jpg',
        bannerImage: '/images/garages/golden-wrench-banner.jpg',
        workspaceImages: ['/images/garages/workspace-7.jpg', '/images/garages/workspace-8.jpg'],
        rating: 4.9,
        reviewCount: 203,
        yearsInBusiness: 15,
        openHours: 'Lun-Sam: 7h00 - 19h00',
    },
    {
        id: 6,
        slug: 'garage-union-sokode',
        name: 'Garage Union Sokode',
        tier: 'normal',
        specialty: ['Mecanique generale', 'Vidange', 'Freinage'],
        description: 'Garage de confiance a Sokode pour tous vos besoins mecaniques.',
        longDescription: 'Garage Union est au service des automobilistes de Sokode depuis 6 ans. Nous proposons des services de mecanique generale, vidange, changement de freins et entretien regulier a des prix accessibles.',
        phone: '+228 94 55 66 77',
        whatsapp: '+22894556677',
        email: 'garageunion@email.com',
        address: '10 Route Nationale 1',
        city: 'Sokode',
        country: 'Togo',
        latitude: 8.9833,
        longitude: 1.1333,
        image: '/images/garages/garage-union.jpg',
        bannerImage: '/images/garages/garage-union-banner.jpg',
        workspaceImages: [],
        rating: 4.0,
        reviewCount: 28,
        yearsInBusiness: 6,
        openHours: 'Lun-Sam: 7h30 - 17h30',
    },
];

export default garages;
