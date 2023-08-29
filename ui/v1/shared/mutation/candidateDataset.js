import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_DATASET = gql`
  mutation CreateCandidateDataset(
    $name: String!
    $slug: String!
    $website: String!
    $visualizationUrl: String
    $datasetType: String!
    $submitterEmail: String!
    $description: String!
    $captcha: String!
  ) {
    createCandidateDataset (
      name: $name
      slug: $slug
      website: $website
      visualizationUrl: $visualizationUrl
      datasetType: $datasetType
      submitterEmail: $submitterEmail
      description: $description
      captcha: $captcha
    ) {
      candidateDataset {
        id
        name
        slug
        website
        visualizationUrl
        description
        submitterEmail
        createdAt
        rejected
      }
      errors
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
        id
        name
        slug
  
        rejected
        rejectedDate
        rejectedBy
        approvedDate
        approvedBy
      }
      errors
    }
  }
`
