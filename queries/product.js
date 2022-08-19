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
