import { gql } from '@apollo/client'

export const CANDIDATE_PRODUCT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeProduct(
    $search: String
  ) {
    paginationAttributeProduct(
      search: $search
    ) {
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
    }
  }
`
