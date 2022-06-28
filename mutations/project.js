import { gql } from '@apollo/client'

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $name: String!,
    $slug: String!,
    $startDate: ISO8601Date,
    $endDate: ISO8601Date,
    $projectUrl: String,
    $description: String!,
    $productId: Int,
    $organizationId: Int
  ) {
    createProject(
      name: $name
      slug: $slug
      startDate: $startDate
      endDate: $endDate
      projectUrl: $projectUrl
      description: $description
      productId: $productId
      organizationId: $organizationId
    ) {
      project {
        slug
      },
      errors
    }
  }
`

export const UPDATE_PROJECT_COUNTRIES = gql`
  mutation UpdateProjectCountries(
    $slug: String!,
    $countriesSlugs: [String!]!
  ) {
    updateProjectCountries(
      slug: $slug,
      countriesSlugs: $countriesSlugs
    ) {
      project {
        slug
        name
        countries {
          id
          name
          slug
        }
      }
    }
  }
`
