import { gql } from '@apollo/client'

export const PRODUCT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeProduct(
    $licenseTypes: [String!]
    $origins: [String!]
    $sectors: [String!]
    $tags: [String!]
    $search: String!
  ) {
    paginationAttributeProduct(
      licenseTypes: $licenseTypes
      origins: $origins
      sectors: $sectors
      tags: $tags
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_PRODUCTS_QUERY = gql`
  query PaginatedProductsRedux(
    $licenseTypes: [String!]
    $origins: [String!]
    $sectors: [String!]
    $tags: [String!]
    $search: String!
    $limit: Int!
    $offset: Int!
  ) {
    paginatedProductsRedux(
      licenseTypes: $licenseTypes
      origins: $origins
      sectors: $sectors
      tags: $tags
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      tags
      imageFile
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
      sustainableDevelopmentGoals {
        id
      }
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

export const PRODUCT_DETAIL_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      imageFile
      website
      owner
      tags
      commercialProduct
      pricingModel
      pricingDetails
      hostingModel
      languages
      productDescription {
        id
        description
        locale
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
          name
        }
      }
      includes {
        id
        name
        slug
        imageFile
        origins {
          name
        }
      }
      organizations {
        id
        name
        slug
        imageFile
        isEndorser
        whenEndorsed
        sectors{
          name
        }
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
      }
      buildingBlocksMappingStatus
      sustainableDevelopmentGoals {
        id
        name
        slug
        imageFile
        number
      }
      sustainableDevelopmentGoalsMappingStatus
      sectors {
        id
        name
        slug
        isDisplayable
      }
      manualUpdate
      mainRepository {
        id
        mainRepository
        name
        slug
        license
      }
      overallMaturityScore
      maturityScoreDetails
      playbooks {
        id
        name
        slug
        imageFile
        tags
      }
      isLinkedWithDpi
    }
  }
`

export const PRODUCT_SEARCH_QUERY = gql`
  query Products($search: String!) {
    products(search: $search) {
      id
      name
      slug
    }
  }
`
