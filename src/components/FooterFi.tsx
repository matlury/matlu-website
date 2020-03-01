import React from "react"
import styles from "./Footer.module.scss"
import CalendarEvents from "./CalendarEvents"
import { Link } from "gatsby"

export const FooterFi: React.FC = () => (
  <footer className={styles.appFooter}>
    <div className={styles.appFooterSection}>
      <h4>Dokumentteja</h4>
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
      <h4>Matlu sosiaalisessa mediassa</h4>
      <ul className={styles.matluSome}>
        <li>
          <i className="fab fa-facebook-square"></i>{" "}
          <a
            href="https://www.facebook.com/Matlury/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </li>
        <li>
          <i className="fab fa-instagram-square"></i>{" "}
          <a
            href="https://www.instagram.com/matlury/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </li>
      </ul>
    </div>
    <div className={styles.appFooterSection}>
      <h4>Tulevia Matlun tapahtumia</h4>
      <div className={styles.calendarEvents}>
        <CalendarEvents language="fi" />
        <Link to="/events">Näytä kaikki tapahtumat</Link>
      </div>
    </div>
    <div className={styles.footerBottom}>&copy; 2020 Matlu ry</div>
  </footer>
)
