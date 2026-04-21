import { gql } from "@apollo/client";

export const EVENT_SUGGESTIONS_QUERY = gql`
  query EventSuggestions {
    eventLocations {
      documentId
      label_fi
      label_en
      location_coordinates
    }
  }
`;

export const TITLE_SUGGESTIONS_QUERY = gql`
  query TitleSuggestions {
    eventRequests(pagination: { limit: 100 }) {
      title {
        fi
        en
      }
    }
  }
`;

export interface EventSuggestionsQueryResult {
  eventLocations: Array<{
    documentId: string;
    label_fi: string;
    label_en: string;
    location_coordinates: unknown;
  }>;
}

export interface TitleSuggestionsQueryResult {
  eventRequests: Array<{
    title: { fi: string; en: string };
  }>;
}

export interface LocationSuggestion {
  documentId: string;
  label_fi: string;
  label_en: string;
  latitude: number | null;
  longitude: number | null;
}

export interface TitleSuggestion {
  fi: string;
  en: string;
}