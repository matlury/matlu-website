import { Language } from "../utils";
import { getFooterMembers, type FooterLogo } from "../lib/cms-data";
import FooterContent from "./FooterContent";

interface FooterProps {
  language: Language;
}

export const Footer = async ({ language }: FooterProps) => {
  let logos: FooterLogo[] = [];
  try {
    logos = await getFooterMembers();
  } catch (error) {
    console.error("Failed to fetch footer members", error);
  }
  return <FooterContent language={language} logos={logos} />;
};
