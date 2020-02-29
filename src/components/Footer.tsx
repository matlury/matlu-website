import React from "react"
import { Language } from "../utils"
import { FooterFi } from "./FooterFi"
import { FooterEn } from "./FooterEn"

interface FooterProps {
  language: Language
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  if (language === "fi") {
    return <FooterFi />
  }
  return <FooterEn />
}
