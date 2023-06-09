import { gql } from '@apollo/client'

export const RESOURCES_SEARCH_QUERY = gql`
  query SearchResources(
    $first: Int
    $after: String
    $search: String
    $showInExchange: Boolean
    $showInWizard: Boolean
  ) {
    searchResources(
      first: $first
      after: $after
      search: $search
      showInExchange: $showInExchange
      showInWizard: $showInWizard
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        name
        slug
        imageFile
        description
        link
      }
    }
  }
`

export const RESOURCE_DETAIL_QUERY = gql`
  query Resource($slug: String!) {
    resource(slug: $slug) {
      id
      name
      slug
      imageFile
      description
      link
      showInExchange
      showInWizard
    }
  }
`
