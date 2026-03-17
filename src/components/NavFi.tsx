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
      prefetch={false}
    >
      {children}
    </Link>
  );
};

export const NavFi: React.FC<LocalizedNavProps> = ({
  navLinks,
  localizedLinks,
}) => {
  return (
    <nav className={styles.nav}>
      <NavLink href={`/`}>Matlu</NavLink>
      <NavLink href={`/board/`} partiallyActive={true}>
        Hallitus
      </NavLink>
      {navLinks.map((navLink) => {
        return (
          <NavLink
            key={navLink.id}
            href={`/${navLink.page}/`}
            partiallyActive={true}
          >
            {navLink.Title.fi}
          </NavLink>
        );
      })}
      <a
        className={styles.navLink}
        href="https://ilotalo.matlu.fi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fas fa-external-link-alt"></i> Matlu Klusteri
      </a>
      <Link
        href={
          localizedLinks.en.startsWith("/en")
            ? localizedLinks.en
            : `/en${localizedLinks.en === "/" ? "/" : localizedLinks.en}`
        }
        className={styles.navLink}
      >
        In english
      </Link>
    </nav>
  );
};
