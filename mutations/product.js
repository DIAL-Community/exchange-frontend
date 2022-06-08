import { gql } from '@apollo/client'

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!,
    $slug: String!,
    $aliases: JSON,
    $imageFile: Upload,
    $website: String,
    $description: String!
  ) {
    createProduct(
      name: $name
      slug: $slug
      aliases: $aliases
      website: $website
      imageFile: $imageFile
      description: $description
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
      },
      errors
    }
  }
`

export const UPDATE_PRODUCT_BUILDING_BLOCKS = gql`
  mutation UpdateProductBuildingBlocks(
    $slug: String!,
    $buildingBlocksSlugs: [String!]!
  ) {
    updateProductBuildingBlocks(
      slug: $slug,
      buildingBlocksSlugs: $buildingBlocksSlugs
    ) {
      product {
        buildingBlocks {
          name,
          slug,
          imageFile
          maturity
        }
      },
      errors
    }
  }
`
