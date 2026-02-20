// application
import { ICurrency } from '~/interfaces/currency';

const dataShopCurrencies: ICurrency[] = [
    {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        rate: 0.92,
    },
    {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        rate: 1,
    },
    {
        code: 'XOF',
        symbol: 'CFA',
        name: 'West African CFA Franc',
        rate: 603,
    },
    {
        code: 'GHS',
        symbol: '₵',
        name: 'Ghanaian Cedi',
        rate: 12.5,
    },
    {
        code: 'NGN',
        symbol: '₦',
        name: 'Nigerian Naira',
        rate: 1550,
    },
];

const dataShopDefaultCurrencyCode = 'USD';

export const dataShopDefaultCurrency: ICurrency = dataShopCurrencies.find((x) => (
    x.code === dataShopDefaultCurrencyCode
))!;

export default dataShopCurrencies;
