import { gql } from '@apollo/client'

export const CANDIDATE_ROLE_QUERY = gql`
  query CandidateRole(
    $email: String!
    $productId: String!
    $organizationId: String!
    $datasetId: String!
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

export const CANDIDATE_DATASETS_QUERY = gql`
  query SearchCandidateDatasets(
    $first: Int,
    $after: String,
    $search: String!
    ) {
    searchCandidateDatasets(
      first: $first,
      after: $after,
      search: $search
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        slug
        name
        website
        dataType
        submitterEmail
        rejected
        description
      }
    }
  }
`

export const CANDIDATE_DATASET_ACTION = gql`
  mutation ApproveRejectCandidateDataset (
    $slug: String!
    $action: String!
  ) {
    approveRejectCandidateDataset (
      slug: $slug
      action: $action
    ) {
      candidateDataset {
        rejected
      }
      errors
    }
  }
`

export const CANDIDATE_PRODUCT_DETAIL_QUERY = gql`
  query CandidateProduct($slug: String!) {
    candidateProduct(slug: $slug) {
      id
      slug
      name
      website
      repository
      submitterEmail
      description
      commercialProduct
      rejected
    }
  }
`
