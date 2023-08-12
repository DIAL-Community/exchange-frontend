import { gql } from '@apollo/client'

export const PROJECT_SEARCH_QUERY = gql`
  query Projects($search: String) {
    projects(search: $search) {
      id
      name
      slug
      origin {
        slug
      }
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
  query PaginatedProjectsRedux(
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
    paginatedProjectsRedux(
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
      organizations {
        id
      }
      products {
        id
      }
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
        name
        slug
      }
      countries {
        name
        slug
      }
      origin {
        slug
        name
      }
    }
  }
`
