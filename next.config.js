const path = require('path')

const securityHeaders = [
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
    },
]

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
    poweredByHeader: false,
    // CSP headers handled by middleware.ts
    async headers() {
        return [
            {
                // Apply these headers to all routes in your application.
                source: '/:path*',
                headers: securityHeaders,
            },
        ]
    },
}

module.exports = nextConfig
