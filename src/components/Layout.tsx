import React from "react"
import PropTypes from "prop-types"

import "../style.scss"
import styles from "./Layout.module.scss"
import logoStyles from "./LogoWrapper.module.scss"
import { Nav } from "./Nav"
import { Language, LocalizedLink } from "../utils"
import { Footer } from "./Footer"
import MatluImage from "./image"

interface LayoutProps {
  language: Language
  localizedLinks: LocalizedLink
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({
  language,
  children,
  localizedLinks,
}) => {
  return (
    <>
      <div className={logoStyles.logoWrapper}>
        <MatluImage />
      </div>
      <Nav language={language} localizedLinks={localizedLinks} />
      <div className={styles.wrapper}>
        <article>{children}</article>
        <Footer language={language} />
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
