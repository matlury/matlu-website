"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocalizedLink } from "../utils";
import styles from "./Nav.module.scss";
import Image from "./image";

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
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  partiallyActive?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = partiallyActive
    ? pathname.startsWith(href)
    : pathname === href;

  return (
    <Link
      href={href}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export const NavEn: React.FC<LocalizedNavProps> = ({
  navLinks,
  localizedLinks,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`${styles.nav} ${isOpen ? styles.isOpen : ""}`}>
      <div className={styles.navTop}>
        <NavLink
          href={`/en/`}
          className={styles.brand}
          onClick={() => setIsOpen(false)}
        >
          <Image imageName="matlu" className={styles.brandLogo} />
        </NavLink>
        <div className={styles.navUtilities}>
          <a
            className={styles.navLink}
            href="https://ilotalo.matlu.fi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Matlu Klusteri
          </a>
          <Link
            href={localizedLinks.fi.replace(/^\/en/, "") || "/"}
            className={styles.navLink}
          >
            Suomeksi
          </Link>
        </div>
        <button
          className={styles.toggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
      </div>

      <div className={styles.navMenu}>
        <NavLink
          href={`/en/board/`}
          partiallyActive={true}
          onClick={() => setIsOpen(false)}
        >
          Board
        </NavLink>
        {navLinks.map((navLink) => (
          <NavLink
            key={navLink.id}
            href={`/en/${navLink.page}/`}
            partiallyActive={true}
            onClick={() => setIsOpen(false)}
          >
            {navLink.Title.en}
          </NavLink>
        ))}
        <div className={styles.navUtilitiesMobile}>
          <a
            className={styles.navLink}
            href="https://ilotalo.matlu.fi"
            target="_blank"
            rel="noopener noreferrer"
          >
            Matlu Klusteri
          </a>
          <Link
            href={localizedLinks.fi.replace(/^\/en/, "") || "/"}
            className={styles.navLink}
          >
            Suomeksi
          </Link>
        </div>
      </div>
    </nav>
  );
};
