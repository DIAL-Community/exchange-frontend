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
      slug: $slug
      buildingBlocksSlugs: $buildingBlocksSlugs
    ) {
      product {
        buildingBlocks {
          name
          slug
          imageFile
          maturity
        }
      },
      errors
    }
  }
`

export const UPDATE_PRODUCT_SECTORS = gql`
  mutation UpdateProductSectors(
    $slug: String!,
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
          imageFile
          whenEndorsed
        }
      },
      errors
    }
  }
`

export const UPDATE_PRODUCT_PROJECTS = gql`
  mutation UpdateProductProjects(
    $slug: String!,
    $projectsSlugs: [String!]!
  ) {
    updateProductProjects(
      slug: $slug,
      projectsSlugs: $projectsSlugs
    ) {
      product {
        slug
        projects {
          id,
          name,
          slug,
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
    $slug: String!,
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
      },
      errors
    }
  }
`

export const UPDATE_PRODUCT_TAGS = gql`
  mutation UpdateProductTags(
    $slug: String!,
    $tags: [String!]!
  ) {
    updateProductTags(
      slug: $slug
      tags: $tags
    ) {
      product {
        slug
        tags
      },
      errors
    }  
  }
`

export const UPDATE_PRODUCT_SDGS = gql`
  mutation UpdateProductSdgs(
    $slug: String!,
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
      }
    }  
  }
`
