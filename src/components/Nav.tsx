import React from "react";
import { Language, LocalizedText, NavQuery } from "../utils";
import { NavFi } from "./NavFi";
import { NavEn } from "./NavEn";
import { graphql, useStaticQuery } from "gatsby";

interface NavProps {
  language: Language;
  localizedLinks: LocalizedText;
}

export const Nav: React.FC<NavProps> = ({ language, localizedLinks }) => {
  const qry: NavQuery = useStaticQuery(graphql`query NavQuery {
  allStrapiPage(
    filter: {attributes: {Draft: {eq: false}, page: {nin: ["home", "board"]}}}
    sort: {attributes: {Ordering: ASC}}
  ) {
    nodes {
      id
      attributes {
        Draft
        Ordering
        page
        Title {
          en
          fi
        }
      }
    }
  }
}`);
  const links = qry.allStrapiPage.nodes.map(node => ({
    id: node.id,
    ...node.attributes,
  }));
  if (language === "fi") {
    return <NavFi navLinks={links} localizedLinks={localizedLinks} />;
  }
  return <NavEn navLinks={links} localizedLinks={localizedLinks} />;
};
