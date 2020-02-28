import React from "react"
import { Link } from "gatsby"
import styles from "./Nav.module.scss"

export const NavEn = () => (
  <nav className={styles.nav}>
    <Link to="/en/home" activeClassName="active">
      <a className={styles.navLink}>Matlu</a>
    </Link>
    <Link to="/en/board" activeClassName="active">
      <a className={styles.navLink}>Board</a>
    </Link>
    <Link to="/en/members" activeClassName="active">
      <a className={styles.navLink}>Members</a>
    </Link>
    <Link to="/en/contact" activeClassName="active">
      <a className={styles.navLink}>Contact</a>
    </Link>
    <Link to="/en/contact" activeClassName="active">
      <a className={styles.navLink}>Interests</a>
    </Link>
    <Link to="/en/events" activeClassName="active">
      <a className={styles.navLink}>Events</a>
    </Link>
    <Link to="/en/rules" activeClassName="active">
      <a className={styles.navLink}>Rules</a>
    </Link>
    <Link to="/en/officials" activeClassName="active">
      <a className={styles.navLink}>Officials</a>
    </Link>
    <a
      className={styles.navLink}
      href="https://matlu.fi/ilotalo"
      target="_blank"
      rel="noopener noreferrer"
    >
      Matlu Klusteri
    </a>
    <Link to="/home">
      <a className={styles.navLink}>Suomeksi</a>
    </Link>
  </nav>
)
