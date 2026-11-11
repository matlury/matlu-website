import { gql } from "@apollo/client";

export const MEMBERS_QUERY = gql`
  query MembersQuery {
    members(
      filters: { enabled: { eq: true } }
      sort: "order:asc"
      pagination: { page: 1, pageSize: 100 }
    ) {
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

export interface MembersQueryResult {
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
