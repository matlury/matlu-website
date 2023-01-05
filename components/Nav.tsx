import cls from 'classnames'
import { locales } from 'common/locale'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from 'styles/components/Nav.module.scss'

interface LocalizedNavProps {
    // navLinks: {
    //     id: string
    //     page: string
    //     Ordering: number
    //     Draft: boolean
    //     Title: {
    //         en: string
    //         fi: string
    //     }
    // }[]
}

const Nav = ({}: LocalizedNavProps) => {
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
            <Link
                href="/board"
                className={cls(styles.navLink, {
                    'active-navlink': router.asPath === '/board',
                })}
            >
                Board
            </Link>
            {/* {navLinks.map((navLink) => (
                <Link
                    key={navLink.id}
                    to={`/en/${navLink.page}/`}
                    className={styles.navLink}
                    activeClassName="active-navlink"
                    partiallyActive={true}
                >
                    {navLink.Title.en}
                </Link>
            ))} */}
            <a
                className={styles.navLink}
                href="https://ilotalo.matlu.fi"
                target="_blank"
                rel="noopener noreferrer"
            >
                <i className="fas fa-external-link-alt"></i> Matlu Klusteri
            </a>
            <Link
                href={{
                    pathname: router.pathname,
                    query: router.query,
                }}
                locale={locales.fi}
                className={styles.navLink}
            >
                Suomeksi
            </Link>
        </nav>
    )
}

export default Nav
