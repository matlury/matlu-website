import React from "react"
import { Link } from "gatsby"
import styles from "./Nav.module.scss"
import { LocalizedLink } from "../utils"

interface LocalizedNavProps {
  localizedLinks: LocalizedLink
  navLinks: {
    id: string
    page: string
    Ordering: number
    Draft: boolean
    Title: {
      en: string
      fi: string
    }
  }[]
}

export const NavEn: React.FC<LocalizedNavProps> = ({
  navLinks,
  localizedLinks,
}) => {
  return (
    <nav className={styles.nav}>
      <Link
        to={`/en/`}
        className={styles.navLink}
        activeClassName="active-navlink"
      >
        Matlu
      </Link>
      <Link
        to={`/en/board`}
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Board
      </Link>
      {navLinks.map(navLink => (
        <Link
          key={navLink.id}
          to={`/en/${navLink.page}`}
          className={styles.navLink}
          activeClassName="active-navlink"
          partiallyActive={true}
        >
          {navLink.Title.en}
        </Link>
      ))}
      <a
        className={styles.navLink}
        href="https://matlu.fi/ilotalo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fas fa-external-link-alt"></i> Matlu Klusteri
      </a>
      <Link to={localizedLinks.fi} className={styles.navLink}>
        Suomeksi
      </Link>
    </nav>
  )
}
