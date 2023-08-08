import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_DATASET = gql`
  mutation CreateCandidateDataset(
    $name: String!
    $slug: String!
    $dataUrl: String!
    $dataType: String!
    $description: String!
    $dataVisualizationUrl: String
    $submitterEmail: String!
    $captcha: String!
  ) {
    createCandidateDataset (
      name: $name
      slug: $slug
      dataUrl: $dataUrl
      dataType: $dataType
      description: $description
      dataVisualizationUrl: $dataVisualizationUrl
      submitterEmail: $submitterEmail
      captcha: $captcha
    ) {
      candidateDataset {
        name
        slug
        dataUrl
        dataVisualizationUrl
        description
      }
      errors
    }
  }  
`
