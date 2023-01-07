const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
    // https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files
    output: 'standalone',
    reactStrictMode: true,
    i18n: {
        locales: ['en', 'fi'],
        defaultLocale: 'fi',
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}

module.exports = nextConfig
