import React from "react"
import { Link } from "gatsby"
import styles from "./Nav.module.scss"
import { LocalizedLink } from "../utils"

interface LocalizedNavProps {
  localizedLinks: LocalizedLink
}

export const NavFi: React.FC<LocalizedNavProps> = ({ localizedLinks }) => (
  <nav className={styles.nav}>
    <Link to="/home" activeClassName="active-navlink">
      <a className={styles.navLink}>Matlu</a>
    </Link>
    <Link to="/board" activeClassName="active-navlink" partiallyActive={true}>
      <a className={styles.navLink}>Hallitus</a>
    </Link>
    <Link to="/members" activeClassName="active-navlink">
      <a className={styles.navLink}>Jäsenjärjestöt</a>
    </Link>
    <Link to="/contact" activeClassName="active-navlink">
      <a className={styles.navLink}>Yhteystiedot</a>
    </Link>
    <Link to="/interests" activeClassName="active-navlink">
      <a className={styles.navLink}>Edunvalvonta</a>
    </Link>
    <Link to="/events" activeClassName="active-navlink">
      <a className={styles.navLink}>Tapahtumat</a>
    </Link>
    <Link to="/rules" activeClassName="active-navlink">
      <a className={styles.navLink}>Säännöt</a>
    </Link>
    <Link to="/officials" activeClassName="active-navlink">
      <a className={styles.navLink}>Virat</a>
    </Link>
    <a
      className={styles.navLink}
      href="https://matlu.fi/ilotalo"
      target="_blank"
      rel="noopener noreferrer"
    >
      Matlu Klusteri
    </a>
    <Link to={localizedLinks.en}>
      <a className={styles.navLink}>In english</a>
    </Link>
  </nav>
)
