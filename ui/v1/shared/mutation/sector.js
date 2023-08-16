import { gql } from '@apollo/client'

export const DELETE_SECTOR = gql`
  mutation DeleteSector($id: ID!) {
    deleteSector(id: $id) {
      sector {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_SECTOR = gql`
  mutation CreateSector(
    $name: String!
    $slug: String!
    $isDisplayable: Boolean!
    $locale: String!
  ) {
    createSector(
      name: $name
      slug: $slug
      isDisplayable: $isDisplayable
      locale: $locale
    ) {
      sector {
        id
        name
        slug
        locale
        isDisplayable
      }
      errors
    }
  }
`
