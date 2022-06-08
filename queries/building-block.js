import { gql } from '@apollo/client'

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
