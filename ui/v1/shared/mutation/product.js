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
        id
        name
        slug
        aliases
        website
        imageFile
        productDescription {
          id
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
        name
        slug
        buildingBlocks {
          id
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
        name
        slug
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
        name
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
        name
        slug
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
    $tagNames: [String!]!
  ) {
    updateProductTags(
      slug: $slug
      tagNames: $tagNames
    ) {
      product {
        id
        name
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
        name
        slug
        sustainableDevelopmentGoals {
          id
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

export const UPDATE_PRODUCT_CATEGORY_INDICATORS = gql`
  mutation UpdateProductIndicators(
    $slug: String!
    $indicatorsData: [JSON!]!
  ) {
    updateProductIndicators(
      slug: $slug
      indicatorsData: $indicatorsData
    ) {
      product {
        id
        name
        slug
        overallMaturityScore
        maturityScoreDetails
      }
      errors
    }
  }
`
