import localFont from '@next/font/local'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.scss'

const Favicons = () => (
    <>
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/img/icon/apple-touch-icon.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/img/icon/favicon-32x32.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/img/icon/favicon-16x16.png"
        />
        <link rel="manifest" href="/img/icon/site.webmanifest" />
        <link
            rel="mask-icon"
            href="/img/icon/safari-pinned-tab.svg"
            color="#5bbad5"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
    </>
)

const openSansFont = localFont({
    src: [
        {
            path: '../public/fonts/Open_Sans/OpenSans-VariableFont_wdth,wght.ttf',
            style: 'normal',
        },
        {
            path: '../public/fonts/Open_Sans/OpenSans-Italic-VariableFont_wdth,wght.ttf',
            style: 'italic',
        },
    ],
    fallback: ['sans-serif'],
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <style jsx global>{`
                :root {
                    --font-base: ${openSansFont.style.fontFamily};
                }
            `}</style>
            <Head>
                <Favicons />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <Component {...pageProps} />
        </>
    )
}
