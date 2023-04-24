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
    $sectorsSlugs: [String!]!
  ) {
    updateProductSectors(
      slug: $slug
      sectorsSlugs: $sectorsSlugs
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
    $projectsSlugs: [String!]!
  ) {
    updateProductProjects(
      slug: $slug
      projectsSlugs: $projectsSlugs
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

export const UPDATE_PRODUCT_ORGANIZATION = gql`
  mutation UpdateProductOrganization(
    $slug: String!
    $organizationsSlugs: [String!]!
  ) {
    updateProductOrganizations(
      slug: $slug
      organizationsSlugs: $organizationsSlugs
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
    $sdgsSlugs: [String!]!
    $mappingStatus: String!
  ) {
    updateProductSdgs(
      slug: $slug
      sdgsSlugs: $sdgsSlugs
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

export const CREATE_CANDIDATE_PRODUCT = gql`
  mutation CreateCandidateProduct(
    $slug: String
    $name: String!
    $website: String!
    $repository: String!
    $description: String!
    $submitterEmail: String!
    $commercialProduct: Boolean
    $captcha: String!
  ) {
    createCandidateProduct(
      slug: $slug
      name: $name
      website: $website
      repository: $repository
      description: $description
      submitterEmail: $submitterEmail
      commercialProduct: $commercialProduct
      captcha: $captcha
    ) {
      candidateProduct {
        id
      }
      errors
    }
  }
`

const generateProductRepositoryMutation = (mutationName) => `
  mutation productRepositoryMutation (
    $slug: String!
    $name: String!
    $absoluteUrl: String!
    $description: String!
    $mainRepository: Boolean!
  ) {
    ${mutationName} (
      slug: $slug
      name: $name
      absoluteUrl: $absoluteUrl
      description: $description
      mainRepository: $mainRepository
    ) {
      slug
    }
  }
 `

export const CREATE_PRODUCT_REPOSITORY = gql(generateProductRepositoryMutation('createProductRepository'))

export const UPDATE_PRODUCT_REPOSITORY = gql(generateProductRepositoryMutation('updateProductRepository'))

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
        overallMaturityScore
        maturityScoreDetails
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
