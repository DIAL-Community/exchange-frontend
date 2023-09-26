import { gql } from '@apollo/client'

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $commentId: String!
    $commentObjectType: String!
    $commentObjectId: Int!
    $text: String!
    $userId: Int!
    $parentCommentId: String
  ) {
    createComment(
      commentId: $commentId
      commentObjectType: $commentObjectType
      commentObjectId: $commentObjectId
      text: $text
      userId: $userId
      parentCommentId: $parentCommentId
    ) {
      errors
    }
  }
`
export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: String!) {
    deleteComment(commentId: $commentId) {
      errors
    }
  }
`
