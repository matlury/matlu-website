import { LocaleName } from 'common/locale'
import Image from 'next/image'
import MatluImage from 'public/img/matlu.png'
import styles from 'styles/components/Layout.module.scss'
import Footer from './Footer'
import Nav from './Nav'

interface LayoutProps {
    locale: LocaleName
    children: React.ReactNode
}

const Layout = ({ locale, children }: LayoutProps) => {
    return (
        <>
            <div className={styles.logoWrapper}>
                <Image
                    className={styles.matluLogo}
                    alt="Matlu ry"
                    src={MatluImage}
                    placeholder="blur"
                    width={160}
                    height={80}
                    quality={100}
                />
            </div>
            <Nav />
            <div className={styles.wrapper}>
                <main>{children}</main>
                <Footer locale={locale} />
            </div>
        </>
    )
}

export default Layout
