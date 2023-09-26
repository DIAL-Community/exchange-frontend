import { gql } from '@apollo/client'

export const STARRED_OBJECT_SEARCH_QUERY = gql`
  query StarredObjects(
    $sourceObjectType: String!
    $sourceObjectValue: String!
  ) {
    starredObjects(
      sourceObjectType: $sourceObjectType
      sourceObjectValue: $sourceObjectValue
    ) {
      id
      starredObjectType
      starredObjectValue
    }
  }
`
