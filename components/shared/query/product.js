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
    $search: String
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
      search: $search
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
    $isLinkedWithDpi: Boolean
    $showGovStackOnly: Boolean
    $search: String
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
      isLinkedWithDpi: $isLinkedWithDpi
      showGovStackOnly: $showGovStackOnly
      search: $search
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
      origins {
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
    }
  }
`

export const PRODUCT_COMPARE_QUERY = gql`
  query CompareProducts($slugs: [String!]!) {
    compareProducts(slugs: $slugs)
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
