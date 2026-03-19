import React from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Language, LocalizedLink } from "../utils";
import MatluLogo from "./MatluLogo";
import styles from "./Layout.module.scss";

interface MainLayoutProps {
  children: React.ReactNode;
  lang: Language;
  hideNav?: boolean;
  localizedLinks?: LocalizedLink;
}

export const MainLayout = ({
  children,
  lang,
  hideNav = false,
  localizedLinks,
}: MainLayoutProps) => {
  const defaultLocalizedLinks = localizedLinks || {
    fi: "/",
    en: "/en/",
  };

  return (
    <>
      <MatluLogo />
      {!hideNav && (
        <Nav language={lang} localizedLinks={defaultLocalizedLinks} />
      )}
      <div className={styles.wrapper}>
        <main>
          <article>{children}</article>
        </main>
        <Footer language={lang} />
      </div>
    </>
  );
};
