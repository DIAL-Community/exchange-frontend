import { gql } from '@apollo/client'

export const CANDIDATE_ORGANIZATION_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateOrganization($search: String) {
    paginationAttributeCandidateOrganization(search: $search) {
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
      website
      description
      createdAt
      rejected
      contacts {
        id
        name
        email
      }
    }
  }
`

export const CANDIDATE_ORGANIZATION_POLICY_QUERY = gql`
  query CandidateOrganization($slug: String!) {
    candidateOrganization(slug: $slug) {
      id
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
      createStorefront
      createdAt
      contacts {
        id
        name
        email
        title
      }

      rejected
      rejectedDate
      rejectedBy
      approvedDate
      approvedBy
    }
  }
`
