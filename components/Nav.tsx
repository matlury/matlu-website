import cls from 'classnames'
import { LocaleName, locales } from 'common/locale'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from 'styles/components/Nav.module.scss'

export interface NavItem {
    id: string
    page: string
    title: string
}

interface NavProps {
    pages: NavItem[]
    locale: LocaleName
}

const ChangeLanguageButton = ({
    currentLocale,
}: {
    currentLocale: LocaleName
}) => {
    const router = useRouter()

    return currentLocale === 'en' ? (
        <Link
            href={{
                pathname: router.pathname,
                query: router.query,
            }}
            locale={locales.fi}
            className={styles.navLink}
        >
            suomeksi
        </Link>
    ) : (
        <Link
            href={{
                pathname: router.pathname,
                query: router.query,
            }}
            locale={locales.en}
            className={styles.navLink}
        >
            In English
        </Link>
    )
}

const Nav = ({ pages, locale }: NavProps) => {
    const router = useRouter()

    return (
        <nav className={styles.nav}>
            <Link
                href="/"
                className={cls(styles.navLink, {
                    'active-navlink': router.asPath === '/',
                })}
            >
                Matlu
            </Link>
            {pages.map((page) => (
                <Link
                    key={page.id}
                    href={`/${page.page}`}
                    className={cls(styles.navLink, {
                        'active-navlink': router.asPath === `/${page.page}`,
                    })}
                >
                    {page.title}
                </Link>
            ))}
            <a
                className={styles.navLink}
                href="https://ilotalo.matlu.fi"
                target="_blank"
                rel="noopener noreferrer"
            >
                <i className="fas fa-external-link-alt"></i> Matlu Klusteri
            </a>
            <ChangeLanguageButton currentLocale={locale} />
        </nav>
    )
}

export default Nav
