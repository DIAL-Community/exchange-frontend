import { gql } from '@apollo/client'

export const BOOKMARK_DETAIL_QUERY = gql`
  query Bookmark($id: ID!) {
    bookmark(id: $id) {
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
  }
`
