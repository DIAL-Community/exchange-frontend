import { gql } from '@apollo/client'

export const PROJECT_SEARCH_QUERY = gql`
  query Projects($search: String!) {
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

export const PROJECT_QUERY = gql`
  query Project($slug: String!) {
    project(slug: $slug) {
      id
      name
      slug
      startDate
      endDate
      projectUrl
      projectDescription {
        description
        locale
      }
      products {
        slug
      }
      organizations {
        slug
      }
    }
  }
`
