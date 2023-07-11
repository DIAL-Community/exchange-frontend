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

export const UPDATE_PRODUCT_BUILDING_BLOCKS = gql`
  mutation UpdateProductBuildingBlocks(
    $slug: String!
    $buildingBlockSlugs: [String!]!
    $mappingStatus: String
  ) {
    updateProductBuildingBlocks(
      slug: $slug
      buildingBlockSlugs: $buildingBlockSlugs
      mappingStatus: $mappingStatus
    ) {
      product {
        id
        buildingBlocks {
          name
          slug
          imageFile
          maturity
        }
        buildingBlocksMappingStatus
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_SECTORS = gql`
  mutation UpdateProductSectors(
    $slug: String!
    $sectorSlugs: [String!]!
  ) {
    updateProductSectors(
      slug: $slug
      sectorSlugs: $sectorSlugs
    ) {
      product {
        id
        sectors {
          id
          name
          slug
        }
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_PROJECTS = gql`
  mutation UpdateProductProjects(
    $slug: String!
    $projectSlugs: [String!]!
  ) {
    updateProductProjects(
      slug: $slug
      projectSlugs: $projectSlugs
    ) {
      product {
        id
        slug
        projects {
          id
          name
          slug
          origin {
            slug
          }
        }
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_ORGANIZATIONS = gql`
  mutation UpdateProductOrganization(
    $slug: String!
    $organizationSlugs: [String!]!
  ) {
    updateProductOrganizations(
      slug: $slug
      organizationSlugs: $organizationSlugs
    ) {
      product {
        id
        organizations {
          id
          name
          slug
          imageFile
          whenEndorsed
          sectors {
            name
          }
        }
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_TAGS = gql`
  mutation UpdateProductTags(
    $slug: String!
    $tags: [String!]!
  ) {
    updateProductTags(
      slug: $slug
      tags: $tags
    ) {
      product {
        id
        slug
        tags
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_SDGS = gql`
  mutation UpdateProductSdgs(
    $slug: String!
    $sdgSlugs: [String!]!
    $mappingStatus: String!
  ) {
    updateProductSdgs(
      slug: $slug
      sdgSlugs: $sdgSlugs
      mappingStatus: $mappingStatus
    ) {
      product {
        id
        slug
        sustainableDevelopmentGoals {
          slug
          name
          imageFile
        }
        sustainableDevelopmentGoalsMappingStatus
      }
      errors
    }
  }
`
