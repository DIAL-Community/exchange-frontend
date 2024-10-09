import { gql } from '@apollo/client'

export const CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateProduct($search: String) {
    paginationAttributeCandidateProduct(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_CANDIDATE_PRODUCTS_QUERY = gql`
  query PaginatedCandidateProducts(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCandidateProducts(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      website
      description
      submitterEmail
      candidateStatus {
        id
        name
        slug
        description
      }
      createdAt
      rejected
    }
  }
`

export const CANDIDATE_PRODUCT_DETAIL_QUERY = gql`
  query CandidateProduct($slug: String!) {
    candidateProduct(slug: $slug) {
      id
      name
      slug
      website
      repository
      description
      submitterEmail
      candidateStatus {
        id
        name
        slug
        description
        nextCandidateStatuses {
          id
          name
          slug
        }
      }
      createdAt
      rejected
      rejectedDate
      rejectedBy
      approvedDate
      approvedBy
    }
  }
`
