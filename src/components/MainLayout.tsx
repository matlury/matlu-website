import React from "react";
import styles from "./Layout.module.scss";
import logoStyles from "./LogoWrapper.module.scss";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import Image from "./image";
import { Language, LocalizedLink } from "../utils";

interface MainLayoutProps {
  children: React.ReactNode;
  lang: Language;
  hideNav?: boolean;
  localizedLinks?: LocalizedLink;
}

export const MainLayout = ({ children, lang, hideNav = false, localizedLinks }: MainLayoutProps) => {
  const defaultLocalizedLinks = localizedLinks || {
    fi: "/",
    en: "/en/",
  };

  return (
    <>
      <div className={logoStyles.logoWrapper}>
        <Image imageName="matlu" />
      </div>
      {!hideNav && <Nav language={lang} localizedLinks={defaultLocalizedLinks} />}
      <div className={styles.wrapper}>
        <article>{children}</article>
        <Footer language={lang} />
      </div>
    </>
  );
};