import Title from 'components/Title'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import MatluImage from 'public/img/matlu.png'
import layoutStyles from 'styles/components/Layout.module.scss'

const NotFoundPage = () => {
    const router = useRouter()
    if (router.locale === 'fi') {
        return (
            <>
                <Title title="Sivua ei löytynyt" />
                <div className={layoutStyles.logoWrapper}>
                    <Link href="/">
                        <Image
                            className={layoutStyles.matluLogo}
                            alt="Matlu ry"
                            src={MatluImage}
                            placeholder="blur"
                            width={160}
                            height={80}
                            quality={100}
                        />
                    </Link>
                </div>
                <main className={layoutStyles.wrapper}>
                    <h1>Sivua ei löytynyt (404)</h1>
                    <p>
                        Hakemasi sivun osoite on voinut muuttua tai sivu on
                        poistettu.
                    </p>
                    <p>
                        <Link href="/">Takaisin etusivulle</Link>
                    </p>
                </main>
            </>
        )
    }

    return (
        <>
            <Title title="Not found" />
            <div className={layoutStyles.logoWrapper}>
                <Link href="/">
                    <Image
                        className={layoutStyles.matluLogo}
                        alt="Matlu ry"
                        src={MatluImage}
                        placeholder="blur"
                        width={160}
                        height={80}
                        quality={100}
                    />
                </Link>
            </div>
            <main className={layoutStyles.wrapper}>
                <h1>Page not found (404)</h1>
                <p>
                    The page you entered could not be found. It may have been
                    moved or deleted.
                </p>
                <p>
                    <Link href="/">Back to home page</Link>
                </p>
            </main>
        </>
    )
}

export default NotFoundPage
