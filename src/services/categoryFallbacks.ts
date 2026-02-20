// Auto parts category fallbacks for when specific categories don't exist
export const FALLBACK_CATEGORIES = {
    // Generic fallbacks that should work in most auto parts systems
    'engine-parts': ['moteur', 'engine', 'drivetrain'],
    'brakes-suspension': ['freinage', 'brakes', 'suspension'],
    'electrical': ['eclairage', 'electronics', 'lighting'],
    'tires-wheels': ['tires', 'wheels', 'rims'],
    'moto-parts': ['pieces-moto', 'motorcycle', 'moto'],
    'engine-drivetrain': ['moteur', 'transmission', 'engine'],
    'power-tools': ['tools', 'equipment', 'garage'],
    'hand-tools': ['tools', 'equipment', 'hand'],
    'plumbing': ['filtration', 'cooling', 'fluids'],
};

export const COMMON_AUTO_PARTS_CATEGORIES = [
    'moteur',
    'freinage', 
    'suspension',
    'filtration',
    'eclairage',
    'carrosserie',
    'echappement',
    'transmission',
    'pieces-auto',
    'pieces-moto',
    'tools'
];

export function getCategoryFallbacks(originalSlug: string): string[] {
    return FALLBACK_CATEGORIES[originalSlug as keyof typeof FALLBACK_CATEGORIES] || [];
}

export function getSafeCategoryList(): string[] {
    return COMMON_AUTO_PARTS_CATEGORIES;
}
