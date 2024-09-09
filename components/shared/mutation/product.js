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
    $govStackEntity: Boolean
    $productStage: String
    $extraAttributes: [ExtraAttributeInput!]!
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
      govStackEntity: $govStackEntity
      productStage: $productStage
      extraAttributes: $extraAttributes
    ) {
      product {
        id
        name
        slug
        aliases
        website
        imageFile
        govStackEntity
        productStage
        extraAttributes
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

export const UPDATE_PRODUCT_CATEGORIES = gql`
  mutation UpdateProductCategories(
    $slug: String!
    $categorySlugs: [String!]!
    $featureSlugs: [String!]!
  ) {
    updateProductCategories(
      slug: $slug
      categorySlugs: $categorySlugs
      featureSlugs: $featureSlugs
    ) {
      product {
        id
        name
        slug
        softwareCategories {
          id
          name
          slug
          softwareFeatures {
            id
            name
            slug
            categoryId
            facilityScale
          }
        }
        softwareFeatures {
          id
          name
          slug
          categoryId
          facilityScale
        }
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_COUNTRIES = gql`
  mutation UpdateProductCountries(
    $slug: String!
    $countrySlugs: [String!]!
  ) {
    updateProductCountries(
      slug: $slug
      countrySlugs: $countrySlugs
    ) {
      product {
        id
        slug
        name
        countries {
          id
          name
          slug
          code
        }
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_EXTRA_ATTRIBUTES = gql`
  mutation UpdateProductExtraAttributes(
    $slug: String!
     $extraAttributes: [ExtraAttributeInput!]!
  ) {
    updateProductExtraAttributes(
      slug: $slug
      extraAttributes: $extraAttributes
    ) {
      product {
        id
        slug
        name
        extraAttributes
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
        sdgs {
          id
          slug
          name
          imageFile
        }
        sdgsMappingStatus
      }
      errors
    }
  }
`

export const UPDATE_PRODUCT_RESOURCES = gql`
  mutation UpdateProductResources(
    $slug: String!
    $resourceSlugs: [String!]!
  ) {
    updateProductResources(
      slug: $slug
      resourceSlugs: $resourceSlugs
    ) {
      product {
        id
        name
        slug
        resources {
          id
          name
          slug
          imageFile
        }
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
