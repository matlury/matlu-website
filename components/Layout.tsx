import { LocaleName } from 'common/locale'
import Image from 'next/image'
import MatluImage from 'public/img/matlu.png'
import styles from 'styles/components/Layout.module.scss'
import Footer from './Footer'
import { FooterDocument } from './Footer/FooterDocument'
import Nav, { NavItem } from './Nav'

export interface LayoutSSRProps {
    locale: LocaleName
    navItems: NavItem[]
    footerDocuments: FooterDocument[]
}

interface LayoutProps extends LayoutSSRProps {
    children: React.ReactNode
}

const Layout = ({
    locale,
    navItems,
    footerDocuments,
    children,
}: LayoutProps) => {
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
            <Nav locale={locale} pages={navItems} />
            <div className={styles.wrapper}>
                <main>{children}</main>
                <Footer documents={footerDocuments} locale={locale} />
            </div>
        </>
    )
}

export default Layout
