import { gql } from '@apollo/client'

export const COMMENTS_QUERY = gql`
  query Comments(
    $commentObjectType: String!
    $commentObjectId: Int!
  ) {
    comments(
      commentObjectType: $commentObjectType
      commentObjectId: $commentObjectId
    ) {
      userId
      comId
      fullName
      avatarUrl
      text
      replies {
        userId
        comId
        fullName
        avatarUrl
        text
      }
    }
  }
`
