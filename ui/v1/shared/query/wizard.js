import { gql } from '@apollo/client'

export const WIZARD_BUILDING_BLOCKS_QUERY = gql`
  query PaginatedBuildingBlocks(
    $sdgs: [String!]
    $useCases: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedBuildingBlocks(
      sdgs: $sdgs
      useCases: $useCases
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
      }
      products {
        id
      }
    }
    paginationAttributeBuildingBlock(
      sdgs: $sdgs
      useCases: $useCases
    ) {
      totalCount
    }
  }
`
