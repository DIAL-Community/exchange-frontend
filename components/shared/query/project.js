import { gql } from '@apollo/client'

export const PROJECT_SEARCH_QUERY = gql`
  query Projects($search: String) {
    projects(search: $search) {
      id
      name
      slug
    }
  }
`

export const PROJECT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeProject(
    $countries: [String!]
    $products: [String!]
    $organizations: [String!]
    $sectors: [String!]
    $tags: [String!]
    $sdgs: [String!]
    $origins: [String!]
    $search: String
  ) {
    paginationAttributeProject(
      countries: $countries
      products: $products
      organizations: $organizations
      sectors: $sectors
      tags: $tags
      sdgs: $sdgs
      origins: $origins
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_PROJECTS_QUERY = gql`
  query PaginatedProjects(
    $countries: [String!]
    $products: [String!]
    $organizations: [String!]
    $sectors: [String!]
    $tags: [String!]
    $sdgs: [String!]
    $origins: [String!]
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedProjects(
      countries: $countries
      products: $products
      organizations: $organizations
      sectors: $sectors
      tags: $tags
      sdgs: $sdgs
      origins: $origins
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      parsedDescription
      projectDescription {
        id
        locale
        description
      }
      organizations {
        id
        slug
        name
        imageFile
      }
      products {
        id
        slug
        name
        imageFile
      }
      sdgs {
        id
      }
    }
  }
`

export const PROJECT_POLICY_QUERY = gql`
  query Project($slug: String!) {
    project(slug: $slug) {
      id
    }
  }
`

export const PROJECT_DETAIL_QUERY = gql`
  query Project($slug: String!) {
    project(slug: $slug) {
      id
      name
      slug
      tags
      projectWebsite
      projectDescription {
        id
        description
        locale
      }
      organizations {
        id
        slug
        name
        imageFile
      }
      products {
        id
        slug
        name
        imageFile
      }
      sectors {
        id
        name
        slug
      }
      sdgs {
        id
        name
        slug
        imageFile
        number
        sdgTargets {
          id
        }
      }
      countries {
        id
        name
        slug
        code
      }
      origin {
        id
        slug
        name
      }
    }
  }
`
