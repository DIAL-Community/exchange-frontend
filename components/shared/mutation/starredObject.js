import { gql } from '@apollo/client'

export const CREATE_STARRED_OBJECT = gql`
  mutation(
    $starredObjectType: String!
    $starredObjectValue: String!
    $sourceObjectType: String!
    $sourceObjectValue: String!
  ) {
    createStarredObject(
      starredObjectType: $starredObjectType
      starredObjectValue: $starredObjectValue
      sourceObjectType: $sourceObjectType
      sourceObjectValue: $sourceObjectValue
    ) {
      starredObject {
        id
        starredObjectType
        starredObjectValue
        sourceObjectType
        sourceObjectValue
        starredByEmail
        starredDate
      }
      errors
    }
  }
`

export const REMOVE_STARRED_OBJECT = gql`
  mutation(
    $starredObjectType: String!
    $starredObjectValue: String!
    $sourceObjectType: String!
    $sourceObjectValue: String!
  ) {
    removeStarredObject(
      starredObjectType: $starredObjectType
      starredObjectValue: $starredObjectValue
      sourceObjectType: $sourceObjectType
      sourceObjectValue: $sourceObjectValue
    ) {
      starredObject {
        id
        starredObjectType
        starredObjectValue
        sourceObjectType
        sourceObjectValue
        starredByEmail
        starredDate
      }
      errors
    }
  }
`
