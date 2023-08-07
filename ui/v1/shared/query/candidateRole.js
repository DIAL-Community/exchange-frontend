import { gql } from '@apollo/client'

export const CANDIDATE_ROLE_QUERY = gql`
  query CandidateRole(
    $email: String!
    $productId: String
    $organizationId: String
    $datasetId: String
  ) {
    candidateRole(
      email: $email
      productId: $productId
      organizationId: $organizationId
      datasetId: $datasetId
    ) {
      id
      productId
      organizationId
      datasetId
      rejected
    }
  }
`

export const CANDIDATE_ROLE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeRole(
    $search: String
  ) {
    paginationAttributeRole(
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_CANDIDATE_ROLES_QUERY = gql`
  query PaginatedCandidateRoles(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCandidateRoles(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
    }
  }
`
