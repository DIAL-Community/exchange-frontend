import { gql } from '@apollo/client'

export const PRODUCT_CONTACT_QUERY = gql`
  query ProductOwners($slug: String!, $type: String!, $captcha: String!) {
    owners(slug: $slug, type: $type, captcha: $captcha) {
      email
    }
  }
`

export const PRODUCT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeProduct(
    $useCases: [String!]
    $buildingBlocks: [String!]
    $sectors: [String!]
    $tags: [String!]
    $countries: [String!]
    $licenseTypes: [String!]
    $workflows: [String!]
    $sdgs: [String!]
    $origins: [String!]
    $isLinkedWithDpi: Boolean
    $showGovStackOnly: Boolean
    $showDpgaOnly: Boolean
    $search: String
    $productStage: String
    $softwareCategories: [String!]
    $softwareFeatures: [String!]
    $featured: Boolean
  ) {
    paginationAttributeProduct(
      useCases: $useCases
      buildingBlocks: $buildingBlocks
      sectors: $sectors
      tags: $tags
      countries: $countries
      licenseTypes: $licenseTypes
      workflows: $workflows
      sdgs: $sdgs
      origins: $origins
      isLinkedWithDpi: $isLinkedWithDpi
      showGovStackOnly: $showGovStackOnly
      showDpgaOnly: $showDpgaOnly
      search: $search
      productStage: $productStage
      softwareCategories: $softwareCategories
      softwareFeatures: $softwareFeatures
      featured: $featured
    ) {
      totalCount
    }
  }
`

export const PAGINATED_PRODUCTS_QUERY = gql`
  query PaginatedProducts(
    $useCases: [String!]
    $buildingBlocks: [String!]
    $sectors: [String!]
    $tags: [String!]
    $countries: [String!]
    $licenseTypes: [String!]
    $workflows: [String!]
    $sdgs: [String!]
    $origins: [String!]
    $softwareCategories: [String!]
    $softwareFeatures: [String!]
    $isLinkedWithDpi: Boolean
    $showGovStackOnly: Boolean
    $showDpgaOnly: Boolean
    $search: String
    $productStage: String
    $featured: Boolean
    $limit: Int!
    $offset: Int!
  ) {
    paginatedProducts(
      useCases: $useCases
      buildingBlocks: $buildingBlocks
      sectors: $sectors
      tags: $tags
      countries: $countries
      licenseTypes: $licenseTypes
      workflows: $workflows
      sdgs: $sdgs
      origins: $origins
      softwareCategories: $softwareCategories
      softwareFeatures: $softwareFeatures
      isLinkedWithDpi: $isLinkedWithDpi
      showGovStackOnly: $showGovStackOnly
      showDpgaOnly: $showDpgaOnly
      search: $search
      productStage: $productStage
      featured: $featured
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      tags
      imageFile
      govStackEntity
      overallMaturityScore
      commercialProduct
      featured
      origins {
        id
        name
        slug
      }
      endorsers {
        id
        name
        slug
      }
      buildingBlocks {
        id
      }
      sdgs {
        id
      }
      countries {
        id
      }
      parsedDescription
      productDescription {
        id
        description
        locale
      }
      mainRepository {
        license
      }
      isLinkedWithDpi
      softwareCategories {
        id
        name
        slug
      }
    }
  }
`

export const PRODUCT_COMPARE_QUERY = gql`
  query CompareProducts($slugs: [String!]!) {
    compareProducts(slugs: $slugs)
  }
`

export const PRODUCT_POLICY_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
    }
  }
`

export const PRODUCT_DETAIL_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      aliases
      imageFile
      website
      extraAttributes
      commercialProduct
      pricingModel
      pricingDetails
      hostingModel
      languages
      haveOwner
      govStackEntity
      productStage
      contact
      featured
      productDescription {
        id
        description
        locale
      }
      countries {
        id
        name
        slug
        code
      }
      origins {
        id
        name
        slug
      }
      endorsers {
        id
        name
        slug
      }
      interoperatesWith {
        id
        name
        slug
        imageFile
        origins {
          id
          slug
          name
        }
      }
      includes {
        id
        name
        slug
        imageFile
        origins {
          id
          name
        }
      }
      organizations {
        id
        name
        slug
        imageFile
      }
      resources {
        id
        slug
        name
        imageFile
      }
      currentProjects(first:10) {
        id
        name
        slug
        origin {
          id
          name
          slug
        }
      }
      buildingBlocks {
        id
        name
        slug
        imageFile
        maturity
        category
      }
      buildingBlocksMappingStatus
      sdgs {
        id
        name
        slug
        imageFile
        number
        sdgTargets {
          id
        }
      }
      sdgsMappingStatus
      sectors {
        id
        name
        slug
      }
      manualUpdate
      mainRepository {
        id
        name
        slug
        license
        absoluteUrl
      }
      overallMaturityScore
      maturityScoreDetails
      isLinkedWithDpi
      tags
      countries {
        id
        name
        code
        slug
      }
      projects {
        id
        name
        slug
        countries {
          id
          name
          slug
          code
        }
      }
      softwareCategories {
        id
        name
        slug
        softwareFeatures {
          id
          name
          slug
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
      approvalStatus {
        id
        name
        slug
      }
    }
  }
`

export const PRODUCT_SEARCH_QUERY = gql`
  query Products($search: String) {
    products(search: $search) {
      id
      name
      slug
    }
  }
`

export const PRODUCT_CATEGORY_INDICATORS_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      productIndicators {
        indicatorValue
        categoryIndicator {
          slug
          name
          indicatorType
          categoryIndicatorDescription {
            description
          }
          rubricCategory {
            id
            name
          }
        }
      }
      notAssignedCategoryIndicators {
        slug
        name
        indicatorType
        categoryIndicatorDescription {
          description
        }
        rubricCategory {
          id
          name
        }
      }
    }
  }
`

export const OWNED_PRODUCTS_QUERY = gql`
  query OwnedProducts {
    ownedProducts {
      id
      name
      slug
    }
  }
`
