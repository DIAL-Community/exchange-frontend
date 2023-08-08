import { gql } from '@apollo/client'

export const CANDIDATE_DATASET_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateDataset(
    $search: String
  ) {
    paginationAttributeCandidateDataset(
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_CANDIDATE_DATASETS_QUERY = gql`
  query PaginatedCandidateDatasets(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCandidateDatasets(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
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
      description
    }
  }
`
