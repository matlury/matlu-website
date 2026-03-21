import { Language } from "../utils";
import { FooterFi } from "./FooterFi";
import { FooterEn } from "./FooterEn";
import { fetchGraphQL } from "../lib/strapi";
import { gql } from "@apollo/client";

export interface FooterLogo {
  id: string;
  name: string;
  href: string;
  src: string;
  alt: string;
}

interface FooterProps {
  language: Language;
}

interface MembersQueryResult {
  members: Array<{
    documentId: string;
    name: string;
    url: string | null;
    logo: {
      url: string;
      alternativeText: string | null;
    } | null;
  }>;
}

const MEMBERS_QUERY = gql`
  query MembersQuery {
    members(filters: { enabled: { eq: true } }, sort: "order:asc") {
      documentId
      name
      url
      logo {
        url
        alternativeText
      }
    }
  }
`;

const STRAPI_URL = (process.env.API_URL || "http://localhost:1337").replace(
  /\/$/,
  "",
);

function toAbsoluteStrapiUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function getMembers(): Promise<FooterLogo[]> {
  try {
    const { data } = await fetchGraphQL<MembersQueryResult>(MEMBERS_QUERY);

    return (data?.members || [])
      .filter((item) => item.logo?.url)
      .map((item) => ({
        id: item.documentId,
        name: item.name,
        href: item.url || "#",
        src: toAbsoluteStrapiUrl(item.logo?.url || ""),
        alt: item.logo?.alternativeText || item.name,
      }));
  } catch (error) {
    console.error("Failed to fetch footer members", error);
    return [];
  }
}

export const Footer = async ({ language }: FooterProps) => {
  const logos = await getMembers();

  if (language === "fi") {
    return <FooterFi language={language} logos={logos} />;
  }
  return <FooterEn language={language} logos={logos} />;
};
