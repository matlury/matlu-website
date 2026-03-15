import { Language, LocalizedText } from "../utils";
import { NavFi } from "./NavFi";
import { NavEn } from "./NavEn";
import { fetchGraphQL } from "../lib/strapi";
import { gql } from "@apollo/client";

interface NavProps {
  language: Language;
  localizedLinks: LocalizedText;
}

interface NavQueryResult {
  pages: Array<{
    documentId: string;
    page: string;
    Ordering: number;
    Draft: boolean;
    Title: {
      en: string;
      fi: string;
    };
  }>;
}

const NAV_QUERY = gql`
  query NavQuery {
    pages(
      filters: { Draft: { eq: false }, page: { notIn: ["home", "board"] } }
      sort: "Ordering:asc"
    ) {
      documentId
      page
      Ordering
      Draft
      Title {
        en
        fi
      }
    }
  }
`;

export const Nav = async ({ language, localizedLinks }: NavProps) => {
  const { data } = await fetchGraphQL<NavQueryResult>(NAV_QUERY);

  const links = (data?.pages || []).map((node) => ({
    id: node.documentId,
    Draft: node.Draft,
    Ordering: node.Ordering,
    page: node.page,
    Title: node.Title,
  }));

  if (language === "fi") {
    return <NavFi navLinks={links} localizedLinks={localizedLinks} />;
  }
  return <NavEn navLinks={links} localizedLinks={localizedLinks} />;
};
