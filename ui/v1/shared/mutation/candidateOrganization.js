import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_ORGANIZATION = gql`
  mutation CreateCandidateOrganization(
    $slug: String
    $website: String!
    $description: String!
    $organizationName: String!
    $name: String!
    $email: String!
    $title: String
    $captcha: String!
  ) {
    createCandidateOrganization(
      slug: $slug
      website: $website
      description: $description
      organizationName: $organizationName
      name: $name
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
