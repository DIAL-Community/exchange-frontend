import { gql } from '@apollo/client'

export const CANDIDATE_DATASET_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCandidateDataset($search: String) {
    paginationAttributeCandidateDataset(search: $search) {
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
      description
      submitterEmail
      createdAt
      rejected
    }
  }
`

export const CANDIDATE_DATASET_DETAIL_QUERY = gql`
  query CandidateDataset($slug: String!) {
    candidateDataset(slug: $slug) {
      id
      name
      slug
      website
      datasetType
      visualizationUrl
      submitterEmail
      createdAt

      rejected
      rejectedDate
      rejectedBy
      approvedDate
      approvedBy
    }
  }
`
