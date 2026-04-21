import { gql } from "@apollo/client";

export const DOCUMENTS_QUERY = gql`
  query DocumentsQuery {
    documents {
      documentId
      title {
        fi
        en
      }
      file {
        url
      }
    }
  }
`;

export interface DocumentsQueryResult {
  documents: Array<{
    documentId: string;
    title: { fi: string; en: string };
    file: { url: string } | null;
  }>;
}