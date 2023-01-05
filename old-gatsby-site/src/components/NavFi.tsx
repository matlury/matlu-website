import React from "react";
import { Link } from "gatsby";
import styles from "./Nav.module.scss";
import { LocalizedLink } from "../utils";

interface LocalizedNavProps {
  localizedLinks: LocalizedLink;
  navLinks: {
    id: string;
    page: string;
    Ordering: number;
    Draft: boolean;
    Title: {
      en: string;
      fi: string;
    };
  }[];
}

export const NavFi: React.FC<LocalizedNavProps> = ({
  navLinks,
  localizedLinks,
}) => {
  return (
    <nav className={styles.nav}>
      <Link
        to={`/`}
        className={styles.navLink}
        activeClassName="active-navlink"
      >
        Matlu
      </Link>
      <Link
        to={`/board/`}
        className={styles.navLink}
        activeClassName="active-navlink"
        partiallyActive={true}
      >
        Hallitus
      </Link>
      {navLinks.map(navLink => (
        <Link
          key={navLink.id}
          to={`/${navLink.page}/`}
          className={styles.navLink}
          activeClassName="active-navlink"
          partiallyActive={true}
        >
          {navLink.Title.fi}
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
      <Link to={localizedLinks.en} className={styles.navLink}>
        In english
      </Link>
    </nav>
  );
};
