import { gql } from '@apollo/client'

export const ADD_BOOKMARK = gql`
  mutation AddBookmark($data: String!, $type: String!) {
    addBookmark(data: $data, type: $type) {
      bookmark {
        id
        bookmarkedBuildingBlocks {
          id
          name
          slug
          imageFile
          maturity
        }
        bookmarkedProducts {
          id
          name
          slug
          imageFile
        }
        bookmarkedUseCases {
          id
          name
          slug
          imageFile
        }
      }
      errors
    }
  }
`

export const REMOVE_BOOKMARK = gql`
  mutation RemoveBookmark($data: String!, $type: String!) {
    removeBookmark(data: $data, type: $type) {
      bookmark {
        id
        bookmarkedBuildingBlocks {
          id
          name
          slug
          imageFile
          maturity
        }
        bookmarkedProducts {
          id
          name
          slug
          imageFile
        }
        bookmarkedUseCases {
          id
          name
          slug
          imageFile
        }
      }
      errors
    }
  }
`
