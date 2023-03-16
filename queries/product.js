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
    $isEndorsed: Boolean
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
      isEndorsed: $isEndorsed
      licenseTypes: $licenseTypes
      search: $search
    ) {
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
        tags
        imageFile
        isLaunchable
        overallMaturityScore
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
        organizations {
          isEndorser
        }
      }
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
