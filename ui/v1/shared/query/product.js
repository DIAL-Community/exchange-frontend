import { gql } from '@apollo/client'

export const PRODUCT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeProduct(
    $search: String!
  ) {
    paginationAttributeProduct(
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_PRODUCTS_QUERY = gql`
  query PaginatedProductsRedux(
    $origins: [String!]
    $sectors: [String!]
    $tags: [String!]
    $licenseTypes: [String!]
    $search: String!
    $limit: Int!
    $offset: Int!
  ) {
    paginatedProductsRedux(
      origins: $origins
      sectors: $sectors
      tags: $tags
      licenseTypes: $licenseTypes
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

export const PRODUCT_QUERY = gql`
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
        description
        locale
      }
      origins {
        name
        slug
      }
      endorsers {
        name
        slug
      }
      interoperatesWith {
        name
        slug
        imageFile
        origins {
          name
        }
      }
      includes {
        name
        slug
        imageFile
        origins {
          name
        }
      }
      organizations {
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
        name
        slug
        origin {
          name
          slug
        }
      }
      buildingBlocks {
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
        name
        slug
        isDisplayable
      }
      manualUpdate
      mainRepository {
        mainRepository
        name
        slug
        license
      }
      overallMaturityScore
      maturityScoreDetails
      playbooks {
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
