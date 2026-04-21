import { gql } from "@apollo/client";

export const PAGE_QUERY = gql`
  query PageQuery($page: String!) {
    pages(filters: { page: { eq: $page }, Draft: { eq: false } }) {
      documentId
      page
      Title {
        fi
        en
      }
      Description {
        fi
        en
      }
      body {
        Fi
        En
      }
      HideFromSearchEngine
      Draft
      Seo {
        metaTitle {
          fi
          en
        }
        metaDescription {
          fi
          en
        }
        shareImage {
          url
          alternativeText
        }
        canonicalUrl
      }
    }
  }
`;

export interface PageQueryResult {
  pages: Array<{
    documentId: string;
    page: string;
    Title: { fi: string; en: string };
    Description: { fi: string; en: string };
    body: { Fi: string; En: string };
    HideFromSearchEngine: boolean;
    Draft: boolean;
    Seo?: {
      metaTitle?: { fi: string; en: string };
      metaDescription?: { fi: string; en: string };
      shareImage?: { url: string; alternativeText?: string };
      canonicalUrl?: string;
    };
  }>;
}

export const ALL_PAGES_QUERY = gql`
  query AllPagesQuery {
    pages(filters: { Draft: { eq: false } }) {
      documentId
      page
      Title {
        fi
        en
      }
      HideFromSearchEngine
    }
  }
`;

export interface AllPagesQueryResult {
  pages: Array<{
    documentId: string;
    page: string;
    Title: { fi: string; en: string };
    HideFromSearchEngine: boolean;
  }>;
}