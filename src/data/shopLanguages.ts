// application
import { ILanguage } from '~/interfaces/language';

const dataShopLanguages: ILanguage[] = [
    {
        locale: 'en',
        code: 'en',
        name: 'English',
        icon: '/images/languages/language-1.png',
        direction: 'ltr',
    },
    {
        locale: 'fr',
        code: 'fr',
        name: 'Français',
        icon: '/images/languages/language-2.png',
        direction: 'ltr',
    },
    {
        locale: 'de',
        code: 'de',
        name: 'Deutsch',
        icon: '/images/languages/language-3.png',
        direction: 'ltr',
    },
];

export const dataShopDefaultLocale = 'en';

export default dataShopLanguages;
