import React, { PropsWithChildren } from "react";
import PropTypes from "prop-types";

import "../style.scss";
import * as styles from "./Layout.module.scss";
import * as logoStyles from "./LogoWrapper.module.scss";
import { Nav } from "./Nav";
import { Language, LocalizedLink } from "../utils";
import { Footer } from "./Footer";
import Image from "./image";

interface LayoutProps {
  language: Language;
  localizedLinks: LocalizedLink;
}

const Layout:  React.FC<PropsWithChildren<LayoutProps>> = ({
  children,
  language,
  localizedLinks,
}) => {
  return (
    <>
      <div className={logoStyles.logoWrapper}>
        <Image imageName="matlu"/>
      </div>
      <Nav language={language} localizedLinks={localizedLinks} />
      <div className={styles.wrapper}>
        <article>{children}</article>
        <Footer language={language} />
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
