import { gql } from '@apollo/client'

export const BUILDING_BLOCK_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeBuildingBlock(
    $search: String
    $sdgs: [String!]
    $useCases: [String!]
    $workflows: [String!]
    $categoryTypes: [String!]
    $showMature: Boolean
    $showGovStackOnly: Boolean
  ) {
    paginationAttributeBuildingBlock(
      search: $search
      sdgs: $sdgs
      useCases: $useCases
      workflows: $workflows
      categoryTypes: $categoryTypes
      showMature: $showMature
      showGovStackOnly: $showGovStackOnly
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
    $showGovStackOnly: Boolean
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedBuildingBlocks(
      sdgs: $sdgs
      useCases: $useCases
      workflows: $workflows
      categoryTypes: $categoryTypes
      showMature: $showMature
      showGovStackOnly: $showGovStackOnly
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
      govStackEntity
      parsedDescription
      buildingBlockDescription {
        id
        description
        locale
      }
      workflows {
        id
      }
      products {
        id
      }
    }
  }
`

export const BUILDING_BLOCK_POLICY_QUERY = gql`
  query BuildingBlock($slug: String!) {
    buildingBlock(slug: $slug) {
      id
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
      maturity
      category
      specUrl
      govStackEntity
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
  query BuildingBlocks($search: String) {
    buildingBlocks(search: $search) {
      id
      name
      slug
      imageFile
      maturity
    }
  }
`
