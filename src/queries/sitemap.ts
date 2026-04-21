import { gql } from "@apollo/client";

export const SITEMAP_PAGES_QUERY = gql`
  query SitemapPagesQuery {
    pages(filters: { Draft: { eq: false } }) {
      page
      HideFromSearchEngine
    }
  }
`;

export const SITEMAP_BOARDS_QUERY = gql`
  query SitemapBoardsQuery {
    boards(filters: { hidden: { eq: false } }, sort: "year:desc") {
      year
      hidden
    }
  }
`;

export interface SitemapPagesQueryResult {
  pages: Array<{
    page: string;
    HideFromSearchEngine: boolean;
  }>;
}

export interface SitemapBoardsQueryResult {
  boards: Array<{
    year: number;
    hidden: boolean;
  }>;
}