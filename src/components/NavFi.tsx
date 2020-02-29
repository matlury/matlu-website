import React from "react"
import { Link } from "gatsby"
import styles from "./Nav.module.scss"
import { LocalizedLink } from "../utils"

interface LocalizedNavProps {
  localizedLinks: LocalizedLink
}

export const NavFi: React.FC<LocalizedNavProps> = ({ localizedLinks }) => (
  <nav className={styles.nav}>
    <Link
      to="/home"
      className={styles.navLink}
      activeClassName="active-navlink"
    >
      Matlu
    </Link>
    <Link
      to="/board"
      className={styles.navLink}
      activeClassName="active-navlink"
      partiallyActive={true}
    >
      Hallitus
    </Link>
    <Link
      to="/members"
      className={styles.navLink}
      activeClassName="active-navlink"
    >
      Jäsenjärjestöt
    </Link>
    <Link
      to="/contact"
      className={styles.navLink}
      activeClassName="active-navlink"
    >
      Yhteystiedot
    </Link>
    <Link
      to="/interests"
      className={styles.navLink}
      activeClassName="active-navlink"
    >
      Edunvalvonta
    </Link>
    <Link
      to="/events"
      className={styles.navLink}
      activeClassName="active-navlink"
    >
      Tapahtumat
    </Link>
    <Link
      to="/rules"
      className={styles.navLink}
      activeClassName="active-navlink"
    >
      Säännöt
    </Link>
    <Link
      to="/officials"
      className={styles.navLink}
      activeClassName="active-navlink"
    >
      Virat
    </Link>
    <a
      className={styles.navLink}
      href="https://matlu.fi/ilotalo"
      target="_blank"
      rel="noopener noreferrer"
    >
      Matlu Klusteri
    </a>
    <Link to={localizedLinks.en} className={styles.navLink}>
      In english
    </Link>
  </nav>
)
