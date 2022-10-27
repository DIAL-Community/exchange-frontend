import { gql } from '@apollo/client'

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $slug: String!
    $aliases: JSON
    $imageFile: Upload
    $website: String
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
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_BUILDING_BLOCKS = gql`
  mutation UpdateProductBuildingBlocks(
    $slug: String!
    $buildingBlocksSlugs: [String!]!
    $mappingStatus: String
  ) {
    updateProductBuildingBlocks(
      slug: $slug
      buildingBlocksSlugs: $buildingBlocksSlugs
      mappingStatus: $mappingStatus
    ) {
      product {
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
        slug
        sustainableDevelopmentGoals {
          slug
          name
          imageFile
        }
        sustainableDevelopmentGoalsMappingStatus
      }
    }  
  }
`

export const CREATE_CANDIDATE_PRODUCT = gql`
  mutation CreateCandidateProduct(
    $name: String!
    $website: String!
    $repository: String!
    $description: String!
    $email: String!
    $captcha: String!
  ) {
    createCandidateProduct(
      name: $name
      website: $website
      repository: $repository
      description: $description
      email: $email
      captcha: $captcha
    ) { slug }
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
      errors
    }  
  }
`
