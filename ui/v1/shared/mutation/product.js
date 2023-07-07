import { gql } from '@apollo/client'

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $slug: String!
    $aliases: JSON
    $imageFile: Upload
    $website: String
    $description: String!
    $pricingUrl: String
    $pricingDetails: String
    $pricingModel: String
    $hostingModel: String
    $commercialProduct: Boolean
  ) {
    createProduct(
      name: $name
      slug: $slug
      aliases: $aliases
      website: $website
      imageFile: $imageFile
      description: $description
      pricingUrl: $pricingUrl
      pricingDetails: $pricingDetails
      pricingModel: $pricingModel
      hostingModel: $hostingModel
      commercialProduct: $commercialProduct
    ) {
      product {
        name
        slug
        aliases
        website
        imageFile
        productDescription {
          description
          locale
        }
      }
      errors
    }
  }
`

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      product {
       id
       slug
       name
      }
      errors
    }
  }
`
