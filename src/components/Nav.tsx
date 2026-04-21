import { Language, LocalizedText } from "../utils";
import { getNavLinks, type NavLink } from "../lib/cms-data";
import NavContent from "./NavContent";

interface NavProps {
  language: Language;
  localizedLinks: LocalizedText;
}

export const Nav = async ({ language, localizedLinks }: NavProps) => {
  let links: NavLink[] = [];
  try {
    links = await getNavLinks();
  } catch (err) {
    console.error("Failed to load navigation links", err);
  }

  return <NavContent lang={language} localizedLinks={localizedLinks} navLinks={links} />;
};
