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

export const CREATE_SECTOR = gql`
  mutation CreateSector(
    $name: String!
    $slug: String!
    $isDisplayable: Boolean!
    $parentSectorId: Int
    $locale: String!
  ) {
    createSector(
      name: $name
      slug: $slug
      isDisplayable: $isDisplayable
      parentSectorId: $parentSectorId
      locale: $locale
    ) {
      sector {
        name
        slug
        locale
        isDisplayable
        originId
        parentSectorId
      }
      errors
    }
  }
`
