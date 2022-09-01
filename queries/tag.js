import { gql } from '@apollo/client'

export const TAG_SEARCH_QUERY = gql`
  query Tags($search: String!) {
    tags(search: $search) {
      id
      name
      slug
    }
  }
`

export const TAGS_LIST_QUERY = gql`
  query SearchTags(
    $first: Int
    $after: String
    $search: String
  ) {
    searchTags(
      first: $first
      after: $after
      search: $search
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
        tagDescription {
          description
          locale
        }
      }
    }
  }
`
