import { gql } from '@apollo/client'

export const BUILDING_BLOCK_DETAIL_QUERY = gql`
  query BuildingBlock($slug: String!) {
    buildingBlock(slug: $slug) {
      id
      name
      slug
      imageFile
      specUrl
      buildingBlockDescription {
        description
        locale
      }
      workflows {
        name
        slug
        imageFile
      }
      products {
        name
        slug
        imageFile
        buildingBlocksMappingStatus
      }
    }
  }
`

export const BUILDING_BLOCK_SEARCH_QUERY = gql`
  query BuildingBlocks($search: String!) {
    buildingBlocks(search: $search) {
      id
      name
      slug
      imageFile
      maturity
    }
  }
`

export const BUILDING_BLOCK_QUERY = gql`
  query BuildingBlock($slug: String!) {
    buildingBlock(slug: $slug) {
      id
      name
      slug
      specUrl
      maturity
      buildingBlockDescription {
        description
        locale
      }
    }
  }
`
