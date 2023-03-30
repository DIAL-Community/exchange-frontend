import { gql } from '@apollo/client'

export const BUILDING_BLOCK_DETAIL_QUERY = gql`
  query BuildingBlock($slug: String!) {
    buildingBlock(slug: $slug) {
      id
      name
      slug
      imageFile
      category
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
      category
      buildingBlockDescription {
        description
        locale
      }
    }
  }
`

export const BUILDING_BLOCKS_QUERY = gql`
  query SearchBuildingBlocks(
    $first: Int,
    $after: String,
    $sdgs: [String!],
    $useCases: [String!],
    $workflows: [String!],
    $categoryTypes: [String!],
    $showMature: Boolean,
    $search: String!
    ) {
    searchBuildingBlocks(
      first: $first,
      after: $after,
      sdgs: $sdgs,
      useCases: $useCases,
      workflows: $workflows,
      categoryTypes: $categoryTypes,
      showMature: $showMature,
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
        imageFile
        maturity
        category
        specUrl
        workflows {
          slug
          name
          imageFile
        }
        products {
          slug
          name
          imageFile
        }
      }
    }
  }
`
