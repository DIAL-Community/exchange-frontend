import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_ORGANIZATION = gql`
  mutation CreateCandidateOrganization(
    $organizationName: String!
    $website: String!
    $name: String!
    $description: String!
    $email: String!
    $title: String!
    $captcha: String!
  ) {
    createCandidateOrganization(
      organizationName: $organizationName
      website: $website
      name: $name
      description: $description
      email: $email
      title: $title
      captcha: $captcha
    ) {
      candidateOrganization {
        id
        name
        slug
        website
        description
      }
      errors
    }
  }
`
