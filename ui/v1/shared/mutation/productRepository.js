import { gql } from '@apollo/client'

export const CREATE_PRODUCT_REPOSITORY = gql`
  mutation CreateProductRepository (
    $productSlug: String!
    $slug: String!
    $name: String!
    $absoluteUrl: String!
    $description: String!
    $mainRepository: Boolean!
  ) {
    createProductRepository (
      productSlug: $productSlug
      slug: $slug
      name: $name
      absoluteUrl: $absoluteUrl
      description: $description
      mainRepository: $mainRepository
    ) {
      productRepository {
        id
        name
        slug
        absoluteUrl
        description
      }
      errors
    }
  }
`

