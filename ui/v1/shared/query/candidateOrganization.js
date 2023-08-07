import { gql } from '@apollo/client'

export const CANDIDATE_ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeOrganization(
    $search: String
  ) {
    paginationAttributeOrganization(
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_CANDIDATE_ORGANIZATIONS_QUERY = gql`
  query PaginatedCandidateOrganizations(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCandidateOrganizations(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
    }
  }
`
