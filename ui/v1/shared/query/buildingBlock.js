import { gql } from '@apollo/client'

export const BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeBuildingBlock(
    $search: String!
  ) {
    paginationAttributeBuildingBlock(
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_BUILDING_BLOCKS_QUERY = gql`
  query PaginatedBuildingBlocks(
    $sdgs: [String!]
    $useCases: [String!]
    $workflows: [String!]
    $categoryTypes: [String!]
    $showMature: Boolean
    $search: String!
    $limit: Int!
    $offset: Int!
  ) {
    paginatedBuildingBlocks(
      sdgs: $sdgs
      useCases: $useCases
      workflows: $workflows
      categoryTypes: $categoryTypes
      showMature: $showMature
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      maturity
      category
      specUrl
      buildingBlockDescription {
        id
        description
        locale
      }
      workflows {
        id
        slug
        name
        imageFile
      }
      products {
        id
        slug
        name
        imageFile
      }
    }
  }
`

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
        id
        description
        locale
      }
      workflows {
        id
        name
        slug
        imageFile
      }
      products {
        id
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
