import React from "react"
import styles from "./Footer.module.scss"
import CalendarEvents from "./CalendarEvents"
import { Link } from "gatsby"

export const FooterEn: React.FC = () => (
  <footer className={styles.appFooter}>
    <div className={styles.appFooterSection}>
      <h4>Documents</h4>
      <ul className={styles.documentLinks}>
        <li>
          <a href="/doc/test.txt">
            Christina Reginan kulkuavainrekisterin tietosuojaseloste
          </a>
        </li>
        <li>
          <a href="/doc/test.txt">Tietosuojapolitiikka</a>
        </li>
        <li>
          <a href="/doc/test.txt">Matlun tietosuojaseloste</a>
        </li>
        <li>
          <a href="/doc/test.txt">Matlun turvallisen tilan periaatteet</a>
        </li>
      </ul>
    </div>
    <div className={styles.appFooterSection}>
      <h4>Matlu in social media</h4>
      <ul className={styles.matluSome}>
        <li>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-square"></i> Facebook
          </a>
        </li>
        <li>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram-square"></i> Instagram
          </a>
        </li>
      </ul>
    </div>
    <div className={styles.appFooterSection}>
      <h4>Upcoming Matlu events</h4>
      <div className={styles.calendarEvents}>
        <CalendarEvents language="en" />
        <Link to="/en/events/">Show all</Link>
      </div>
    </div>
    <div className={styles.footerBottom}>&copy; 2020 Matlu ry</div>
  </footer>
)
