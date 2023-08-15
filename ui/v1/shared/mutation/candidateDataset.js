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
