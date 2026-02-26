// noinspection JSUnusedGlobalSymbols
module.exports = {
    env: {
        basePath: process.env.BASE_PATH || '',
    },
    basePath: process.env.BASE_PATH || '',
    i18n: {
        locales: ['en', 'fr', 'de'],
        defaultLocale: 'en',
    },
    // Disable source maps in development to prevent RangeError
    productionBrowserSourceMaps: false,
    webpack: (config, { dev }) => {
        if (dev) {
            config.devtool = false;
        }
        return config;
    },
    output: 'standalone',
};
