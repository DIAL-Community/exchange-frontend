import { gql } from '@apollo/client'

export const DELETE_CATEGORY_INDICATOR = gql`
  mutation DeleteCategoryIndicator($id: ID!) {
    deleteCategoryIndicator(id: $id) {
      rubricCategorySlug
    }
  }
`
