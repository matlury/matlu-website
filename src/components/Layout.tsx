import React, { PropsWithChildren } from "react";

import "../style.scss";
import * as styles from "./Layout.module.scss";
import * as logoStyles from "./LogoWrapper.module.scss";
import { Nav } from "./Nav";
import { Language, LocalizedLink } from "../utils";
import { Footer } from "./Footer";
import Image from "./image";
import LivePreview from "./LivePreview";

interface LayoutProps {
  language: Language;
  localizedLinks: LocalizedLink;
}

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  language,
  localizedLinks,
}) => {
  return (
    <>
      <LivePreview />
      <div className={logoStyles.logoWrapper}>
        <Image imageName="matlu" />
      </div>
      <Nav language={language} localizedLinks={localizedLinks} />
      <div className={styles.wrapper}>
        <article>{children}</article>
        <Footer language={language} />
      </div>
    </>
  );
};

export default Layout;
