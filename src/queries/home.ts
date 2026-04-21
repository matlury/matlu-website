import { gql } from "@apollo/client";

export const HOME_PAGE_QUERY = gql`
  query HomePageQuery {
    pages(filters: { page: { eq: "home" }, Draft: { eq: false } }) {
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
    calendarEvents(filters: { hidden: { eq: false } }, sort: "start_date:asc") {
      documentId
      start_date
      end_date
      title {
        fi
        en
      }
      location {
        fi
        en
      }
      description {
        fi
        en
      }
      organizer_name
      price
      event_link
      hide_location
      location_coordinates
      hidden
    }
  }
`;

export interface HomePageQueryResult {
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
  calendarEvents: Array<{
    documentId: string;
    start_date: string;
    end_date: string | null;
    title: { fi: string; en: string };
    location: { fi: string; en: string } | null;
    description: { fi: string; en: string } | null;
    organizer_name: string | null;
    price: string | null;
    event_link: string;
    hide_location: boolean;
    location_coordinates: { lat: number; lng: number } | null;
    hidden: boolean;
  }>;
}