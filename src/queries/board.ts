import { gql } from "@apollo/client";

export const BOARD_QUERY = gql`
  query BoardQuery($year: Int!) {
    boards(
      filters: { hidden: { eq: false }, year: { eq: $year } }
      sort: "year:desc"
    ) {
      documentId
      year
      hidden
      members {
        id
        name
        email
        role {
          fi
          en
        }
      }
      officers {
        id
        name
        role {
          fi
          en
        }
      }
      teams {
        id
        title {
          fi
          en
        }
        team_members {
          id
          name
        }
      }
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

export const LATEST_BOARD_QUERY = gql`
  query LatestBoardQuery {
    boards(filters: { hidden: { eq: false } }, sort: "year:desc") {
      documentId
      year
      hidden
      members {
        id
        name
        email
        role {
          fi
          en
        }
      }
      officers {
        id
        name
        role {
          fi
          en
        }
      }
      teams {
        id
        title {
          fi
          en
        }
        team_members {
          id
          name
        }
      }
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

export const ALL_BOARD_YEARS_QUERY = gql`
  query AllBoardYearsQuery {
    boards(filters: { hidden: { eq: false } }, sort: "year:desc") {
      year
    }
  }
`;

export interface BoardQueryResult {
  boards: Array<{
    documentId: string;
    year: number;
    hidden: boolean;
    members: Array<{
      id: string;
      name: string;
      email: string | null;
      role: { fi: string; en: string };
    }>;
    officers: Array<{
      id: string;
      name: string;
      role: { fi: string; en: string };
    }>;
    teams: Array<{
      id: string;
      title: { fi: string; en: string };
      team_members: Array<{ id: string; name: string }>;
    }>;
    Seo?: {
      metaTitle?: { fi: string; en: string };
      metaDescription?: { fi: string; en: string };
      shareImage?: { url: string; alternativeText?: string };
      canonicalUrl?: string;
    };
  }>;
}

export interface BoardYearsQueryResult {
  boards: Array<{ year: number }>;
}
