"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LocalizedLink } from "../utils";
import styles from "./Nav.module.scss";
import Image from "./image";
import {
  DrawerRoot,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  const [open, setOpen] = React.useState(false);

  const menuItems = (
    <>
      <NavLink href={`/`} onClick={() => setOpen(false)}>
        Etusivu
      </NavLink>
      <NavLink
        href={`/board/`}
        partiallyActive={true}
        onClick={() => setOpen(false)}
      >
        Hallitus
      </NavLink>
      {navLinks.map((navLink) => {
        return (
          <NavLink
            key={navLink.id}
            href={`/${navLink.page}/`}
            partiallyActive={true}
            onClick={() => setOpen(false)}
          >
            {navLink.Title.fi}
          </NavLink>
        );
      })}
      <NavLink
        href="https://www.potentiaali.com"
        onClick={() => setOpen(false)}
        className={styles.navLink}
      >
        Kumpulan Potentiaali
      </NavLink>
    </>
  );

  return (
    <nav className={styles.nav}>
      <div className={styles.navTop}>
        <NavLink href={`/`} className={styles.brand}>
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

        <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
          <DrawerTrigger asChild>
            <button
              className={styles.toggle}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <i className={open ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </DrawerTrigger>
          <DrawerContent backgroundColor="var(--main-color)" showCloseButton={true}>
            <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255,255,255,0.1)">
              <div className={styles.brand}>
                <Image imageName="matlu" className={styles.brandLogo} />
                <span className={styles.brandText}>Matlu ry</span>
              </div>
            </DrawerHeader>
            <DrawerBody padding="0">
              <div className={styles.navMenuMobile}>
                {menuItems}
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
            </DrawerBody>
          </DrawerContent>
        </DrawerRoot>
      </div>

      <div className={styles.navMenu}>{menuItems}</div>
    </nav>
  );
};
