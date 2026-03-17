"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocalizedLink } from "../utils";
import styles from "./Nav.module.scss";

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

const NavLink = ({
  href,
  children,
  partiallyActive = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  partiallyActive?: boolean;
  className?: string;
}) => {
  const pathname = usePathname();
  const isActive = partiallyActive
    ? pathname.startsWith(href)
    : pathname === href;

  return (
    <Link
      href={href}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""} ${className || ""}`}
    >
      {children}
    </Link>
  );
};

export const NavEn: React.FC<LocalizedNavProps> = ({
  navLinks,
  localizedLinks,
}) => {
  return (
    <nav className={styles.nav}>
      <NavLink href={`/en/`}>Matlu</NavLink>
      <NavLink href={`/en/board/`} partiallyActive={true}>
        Board
      </NavLink>
      {navLinks.map((navLink) => (
        <NavLink
          key={navLink.id}
          href={`/en/${navLink.page}/`}
          partiallyActive={true}
        >
          {navLink.Title.en}
        </NavLink>
      ))}
      <a
        className={styles.navLink}
        href="https://ilotalo.matlu.fi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fas fa-external-link-alt"></i> Matlu Klusteri
      </a>
      <Link
        href={localizedLinks.fi.replace(/^\/en/, "") || "/"}
        className={styles.navLink}
      >
        Suomeksi
      </Link>
    </nav>
  );
};
