import { gql } from '@apollo/client'

export const CANDIDATE_ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateOrganization(
    $search: String
  ) {
    paginationAttributeCandidateOrganization(
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
      description
    }
  }
`

export const CANDIDATE_ORGANIZATION_DETAIL_QUERY = gql`
  query CandidateOrganization($slug: String!) {
    candidateOrganization(slug: $slug) {
      id
      name
      slug
      website
      description
    }
  }
`
