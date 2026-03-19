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
      prefetch={false}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export const NavFi: React.FC<LocalizedNavProps> = ({
  navLinks,
  localizedLinks,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`${styles.nav} ${isOpen ? styles.isOpen : ""}`}>
      <div className={styles.navTop}>
        <NavLink
          href={`/`}
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
            href={
              localizedLinks.en.startsWith("/en")
                ? localizedLinks.en
                : `/en${localizedLinks.en === "/" ? "/" : localizedLinks.en}`
            }
            className={styles.navLink}
          >
            In english
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
          href={`/board/`}
          partiallyActive={true}
          onClick={() => setIsOpen(false)}
        >
          Hallitus
        </NavLink>
        {navLinks.map((navLink) => {
          return (
            <NavLink
              key={navLink.id}
              href={`/${navLink.page}/`}
              partiallyActive={true}
              onClick={() => setIsOpen(false)}
            >
              {navLink.Title.fi}
            </NavLink>
          );
        })}
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
            href={
              localizedLinks.en.startsWith("/en")
                ? localizedLinks.en
                : `/en${localizedLinks.en === "/" ? "/" : localizedLinks.en}`
            }
            className={styles.navLink}
          >
            In english
          </Link>
        </div>
      </div>
    </nav>
  );
};
