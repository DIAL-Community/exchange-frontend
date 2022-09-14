import { gql } from '@apollo/client'

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
      }
      sustainableDevelopmentGoalsMappingStatus
      sectors {
        name
        slug
        isDisplayable
      }
      maturityScore
      maturityScores
      manualUpdate
      mainRepository {
        mainRepository
        name
        slug
      }
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

export const OWNED_PRODUCTS_QUERY = gql`
  query OwnedProducts {
    ownedProducts {
      id
      name
      slug
    }
  }
`

export const PRODUCTS_QUERY = gql`
  query SearchProducts (
    $first: Int
    $after: String
    $origins: [String!]
    $sectors: [String!]
    $countries: [String!]
    $organizations: [String!]
    $sdgs: [String!]
    $tags: [String!]
    $useCases: [String!]
    $workflows: [String!]
    $buildingBlocks: [String!]
    $endorsers: [String!]
    $productDeployable: Boolean
    $withMaturity: Boolean
    $licenseTypes: [String!]
    $search: String!
  ) {
    searchProducts (
      first: $first
      after: $after
      origins: $origins
      sectors: $sectors
      countries: $countries
      organizations: $organizations
      sdgs: $sdgs
      tags: $tags
      useCases: $useCases
      workflows: $workflows
      buildingBlocks: $buildingBlocks
      endorsers: $endorsers
      productDeployable: $productDeployable
      withMaturity: $withMaturity
      licenseTypes: $licenseTypes
      search: $search
    ) {
      __typename
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        name
        slug
        imageFile
        isLaunchable
        maturityScore
        tags
        commercialProduct
        endorsers {
          name
          slug
        }
        origins {
          name
          slug
        }
        buildingBlocks {
          slug
          name
          imageFile
        }
        sustainableDevelopmentGoals {
          slug
          name
        }
        productDescription {
          description
          locale
        }
        mainRepository {
          license
        }
      }
    }
  }
`
