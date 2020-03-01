import React from "react"
import { Link } from "gatsby"
import styles from "./Nav.module.scss"
import { LocalizedLink } from "../utils"

interface LocalizedNavProps {
  localizedLinks: LocalizedLink
}

export const NavEn: React.FC<LocalizedNavProps> = ({ localizedLinks }) => {
  return (
    <nav className={styles.nav}>
      <Link
        to="/en/home"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Matlu
      </Link>
      <Link
        to="/en/board"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Board
      </Link>
      <Link
        to="/en/members"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Members
      </Link>
      <Link
        to="/en/contact"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Contact
      </Link>
      <Link
        to="/en/interests"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Interests
      </Link>
      <Link
        to="/en/events"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Events
      </Link>
      <Link
        to="/en/rules"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Rules
      </Link>
      <Link
        to="/en/officials"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Officials
      </Link>
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
