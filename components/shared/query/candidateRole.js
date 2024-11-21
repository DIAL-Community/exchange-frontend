import { gql } from '@apollo/client'

export const CANDIDATE_ROLE_POLICY_QUERY = gql`
  query CandidateRole($id: ID) {
    candidateRole(id: $id) {
      id
    }
  }
`

export const CANDIDATE_ROLE_DETAIL_QUERY = gql`
  query CandidateRole(
    $id: ID
    $email: String
    $productId: String
    $organizationId: String
    $datasetId: String
  ) {
    candidateRole(
      id: $id
      email: $email
      productId: $productId
      organizationId: $organizationId
      datasetId: $datasetId
    ) {
      id
      roles
      email
      description
      createdAt
      productId
      organizationId
      datasetId

      rejected
      rejectedDate
      rejectedBy
      approvedDate
      approvedBy
    }
  }
`

export const OWNER_CANDIDATE_ROLE_DETAIL_QUERY = gql`
  query CandidateRole(
    $id: ID
    $email: String
    $productId: String
    $organizationId: String
    $datasetId: String
  ) {
    candidateRole(
      id: $id
      email: $email
      productId: $productId
      organizationId: $organizationId
      datasetId: $datasetId
    ) {
      id
      rejected
    }
  }
`

export const CANDIDATE_ROLE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateRole($search: String) {
    paginationAttributeCandidateRole(search: $search) {
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
      email
      roles
      description
      createdAt
      rejected
    }
  }
`
