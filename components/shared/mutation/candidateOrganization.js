import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_ORGANIZATION = gql`
  mutation CreateCandidateOrganization(
    $slug: String
    $website: String!
    $description: String!
    $organizationName: String!
    $createStorefront: Boolean!
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
      createStorefront: $createStorefront
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
        createStorefront
      }
      errors
    }
  }
`
