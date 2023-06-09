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
        id
        slug
      }
      errors
    }
  }
`

export const UPDATE_PROJECT_SECTORS = gql`
  mutation UpdateProjectSectors(
    $slug: String!,
    $sectorSlugs: [String!]!
  ) {
    updateProjectSectors(
      slug: $slug
      sectorSlugs: $sectorSlugs
    ) {
      project {
        id
        sectors {
          id
          name
          slug
        }
      }
      errors
    }
  }
`

export const UPDATE_PROJECT_TAGS = gql`
  mutation UpdateProjectTags(
    $slug: String!,
    $tags: [String!]!
  ) {
    updateProjectTags(
      slug: $slug
      tags: $tags
    ) {
      project {
        id
        slug
        tags
      }
      errors
    }
  }
`

export const UPDATE_PROJECT_ORGANIZATIONS = gql`
  mutation UpdateProjectOrganizations(
    $slug: String!,
    $organizationSlugs: [String!]!
  ) {
    updateProjectOrganizations(
      slug: $slug
      organizationSlugs: $organizationSlugs
    ) {
      project {
        id
        organizations {
          id
          name
          slug
          imageFile
          whenEndorsed
          sectors {
            name
          }
        }
      }
      errors
    }
  }
`

export const UPDATE_PROJECT_COUNTRIES = gql`
  mutation UpdateProjectCountries(
    $slug: String!,
    $countrySlugs: [String!]!
  ) {
    updateProjectCountries(
      slug: $slug,
      countrySlugs: $countrySlugs
    ) {
      project {
        id
        slug
        name
        countries {
          id
          name
          slug
        }
      }
      errors
    }
  }
`

export const UPDATE_PROJECT_PRODUCTS = gql`
  mutation UpdateProjectProducts(
    $slug: String!,
    $productSlugs: [String!]!
  ) {
    updateProjectProducts(
      slug: $slug
      productSlugs: $productSlugs
    ) {
      project {
        id
        products {
          id
          name
          slug
          imageFile
        }
      }
      errors
    }
  }
`
