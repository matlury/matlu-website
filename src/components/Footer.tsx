import { Language } from "../utils";
import { FooterFi } from "./FooterFi";
import { FooterEn } from "./FooterEn";

interface FooterProps {
  language: Language;
}

export const Footer = ({ language }: FooterProps) => {
  if (language === "fi") {
    return <FooterFi language={language} />;
  }
  return <FooterEn language={language} />;
};
