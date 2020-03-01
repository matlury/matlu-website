import React from "react"
import { Link } from "gatsby"
import styles from "./Nav.module.scss"
import { LocalizedLink } from "../utils"

interface LocalizedNavProps {
  localizedLinks: LocalizedLink
}

export const NavFi: React.FC<LocalizedNavProps> = ({ localizedLinks }) => {
  return (
    <nav className={styles.nav}>
      <Link
        to="/home"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
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
        partiallyActive={true}
      >
        Jäsenjärjestöt
      </Link>
      <Link
        to="/contact"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Yhteystiedot
      </Link>
      <Link
        to="/interests"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Edunvalvonta
      </Link>
      <Link
        to="/events"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Tapahtumat
      </Link>
      <Link
        to="/rules"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Säännöt
      </Link>
      <Link
        to="/officials"
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Virat
      </Link>
      <a
        className={styles.navLink}
        href="https://matlu.fi/ilotalo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fas fa-external-link-alt"></i> Matlu Klusteri
      </a>
      <Link to={localizedLinks.en} className={styles.navLink}>
        In english
      </Link>
    </nav>
  )
}
