import { gql } from '@apollo/client'

export const DELETE_REGION = gql`
  mutation DeleteRegion($id: ID!) {
    deleteRegion(id: $id) {
      region {
        id
        slug
        name
        description
      }
      errors
    }
  }
`

export const CREATE_REGION = gql`
  mutation CreateRegion(
    $name: String!
    $slug: String!
    $description: String!
  ) {
    createRegion(
      name: $name
      slug: $slug
      description: $description
    ) {
      region {
        id
        name
        slug
        description
      }
      errors
    }
  }
`

export const UPDATE_REGION_COUNTRIES = gql`
  mutation UpdateRegionCountries(
    $slug: String!
    $countrySlugs: [String!]!
  ) {
    updateRegionCountries(
      slug: $slug
      countrySlugs: $countrySlugs
    ) {
      region {
        id
        name
        slug
        countries {
          id
          name
          slug
          code
        }
      }
      errors
    }
  }
`
