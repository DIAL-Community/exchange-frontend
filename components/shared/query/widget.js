import { gql } from '@apollo/client'

export const PRODUCT_WIDGET_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      tags
      imageFile
      origins {
        id
        name
        slug
      }
      commercialProduct
      mainRepository {
        license
      }
      parsedDescription
    }
  }
`

export const BUILDING_BLOCK_WIDGET_QUERY = gql`
  query BuildingBlock($slug: String!) {
    buildingBlock(slug: $slug) {
      id
      slug
      name
      imageFile
      category
      parsedDescription
    }
  }
`
