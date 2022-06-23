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
      discourseId
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
      sustainableDevelopmentGoals {
        id
        name
        slug
        imageFile
      }
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

export const PRODUCT_BUILDING_BLOCKS_FRAGMENT = gql`
  fragment BuildingBlocks on Product {
    buildingBlocks {
      name
      slug
      imageFile
      maturity
    }
  }
`
