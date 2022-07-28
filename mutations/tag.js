import { gql } from '@apollo/client'

export const DELETE_TAG = gql`
  mutation DeleteTag ($id: ID!) {
    deleteTag(id: $id) {
      tag {
        id
      }
      errors
    }
  }
`
