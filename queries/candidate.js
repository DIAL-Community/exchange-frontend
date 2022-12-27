import { gql } from '@apollo/client'

export const CANDIDATE_ROLE_QUERY = gql`
  query CandidateRole(
    $email: String!
    $productId: String!
    $organizationId: String!
  ) {
    candidateRole(
      email: $email
      productId: $productId
      organizationId: $organizationId
    ) {
      id
      productId
      organizationId
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
        dataUrl
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
