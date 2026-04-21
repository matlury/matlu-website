import { gql } from "@apollo/client";

export const NAV_QUERY = gql`
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

export interface NavQueryResult {
  pages: Array<{
    documentId: string;
    page: string;
    Ordering: number;
    Draft: boolean;
    Title: { en: string; fi: string };
  }>;
}