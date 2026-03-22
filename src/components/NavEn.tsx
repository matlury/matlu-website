"use client";

import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
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
  DrawerCloseTrigger,
} from "@/components/ui/drawer";
import { CloseButton } from "@chakra-ui/react";

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
  const [open, setOpen] = React.useState(false);

  const menuItems = (
    <>
      <NavLink href={`/en/`} onClick={() => setOpen(false)}>
        Home
      </NavLink>
      <NavLink
        href={`/en/board/`}
        partiallyActive={true}
        onClick={() => setOpen(false)}
      >
        Board
      </NavLink>
      {navLinks.map((navLink) => (
        <NavLink
          key={navLink.id}
          href={`/en/${navLink.page}/`}
          partiallyActive={true}
          onClick={() => setOpen(false)}
        >
          {navLink.Title.en}
        </NavLink>
      ))}
    </>
  );

  return (
    <nav className={styles.nav}>
      <div className={styles.navTop}>
        <NavLink href={`/en/`} className={styles.brand}>
          <Image imageName="matlu" className={styles.brandLogo} />
        </NavLink>
        <div className={styles.navUtilities}>
          <a
            className={styles.navLink}
            href="https://ilotalo.matlu.fi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
              Matlu Klusteri <FaExternalLinkAlt style={{ marginLeft: 4, fontSize: "0.9em", verticalAlign: "middle" }} />
            </span>
          </a>
          <a
            className={styles.navLink}
            href="https://www.potentiaali.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
              Kumpulan Potentiaali <FaExternalLinkAlt style={{ marginLeft: 4, fontSize: "0.9em", verticalAlign: "middle" }} />
            </span>
          </a>
          <Link
            href={localizedLinks.fi.replace(/^\/en/, "") || "/"}
            className={styles.navLink}
          >
            Suomeksi
          </Link>
        </div>

        <DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)} size="xs">
          <DrawerTrigger asChild>
            <button
              className={styles.toggle}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <i className={open ? "fas fa-times" : "fas fa-bars"}></i>
            </button>
          </DrawerTrigger>
          <DrawerContent backgroundColor="var(--main-color)" maxWidth={{ base: "75vw", md: "400px" }}>
            <DrawerHeader
              borderBottomWidth="1px"
              borderColor="rgba(255,255,255,0.1)"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              padding="0"
              height="60px"
              px="1rem"
            >
              <DrawerCloseTrigger asChild>
                <CloseButton
                  size="md"
                  color="white"
                  variant="ghost"
                  _hover={{ bg: "rgba(255,255,255,0.1)" }}
                  margin="0"
                  position="relative"
                  right="auto"
                  top="auto"
                />
              </DrawerCloseTrigger>
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
                    <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
                      Matlu Klusteri <FaExternalLinkAlt style={{ marginLeft: 4, fontSize: "0.9em", verticalAlign: "middle" }} />
                    </span>
                  </a>
                  <a
                    className={styles.navLink}
                    href="https://www.potentiaali.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span style={{ whiteSpace: "nowrap", display: "inline-flex", alignItems: "center" }}>
                      Kumpulan Potentiaali <FaExternalLinkAlt style={{ marginLeft: 4, fontSize: "0.9em", verticalAlign: "middle" }} />
                    </span>
                  </a>
                  <Link
                    href={localizedLinks.fi.replace(/^\/en/, "") || "/"}
                    className={styles.navLink}
                  >
                    Suomeksi
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
