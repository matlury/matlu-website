import localFont from '@next/font/local'
import type { AppProps } from 'next/app'
import '../styles/globals.scss'

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
            <Component {...pageProps} />
        </>
    )
}
