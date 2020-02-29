import React from "react"
import { Language, LocalizedLink } from "../utils"
import { NavFi } from "./NavFi"
import { NavEn } from "./NavEn"

interface NavProps {
  language: Language
  localizedLinks: LocalizedLink
}

export const Nav: React.FC<NavProps> = ({ language, localizedLinks }) => {
  if (language === "fi") {
    return <NavFi localizedLinks={localizedLinks} />
  }
  return <NavEn localizedLinks={localizedLinks} />
}
