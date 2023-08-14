import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_DATASET = gql`
  mutation CreateCandidateDataset(
    $name: String!
    $slug: String!
    $website: String!
    $datasetType: String!
    $description: String!
    $visualizationUrl: String
    $submitterEmail: String!
    $captcha: String!
  ) {
    createCandidateDataset (
      name: $name
      slug: $slug
      website: $website
      datasetType: $datasetType
      description: $description
      visualizationUrl: $visualizationUrl
      submitterEmail: $submitterEmail
      captcha: $captcha
    ) {
      candidateDataset {
        name
        slug
        website
        visualizationUrl
        description
      }
      errors
    }
  }  
`
