import { gql } from '@apollo/client'

export const DELETE_SECTOR = gql`
  mutation DeleteSector(
    $id: ID!
  ) {
    deleteSector(
      id: $id
    ) {
      sector {
       id
       slug
       name
      }
    }
  }
`
