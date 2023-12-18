import { gql } from '@apollo/client'

export const DELETE_CITY = gql`
  mutation DeleteCity($id: ID!) {
    deleteCity(id: $id) {
      country {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_CITY = gql`
  mutation CreateCity(
    $slug: String
    $cityName: String!
    $provinceName: String!
    $countryName: String!
  ) {
    createCity(
      slug: $slug
      cityName: $cityName
      provinceName: $provinceName
      countryName: $countryName
    ) {
      city {
        id
        name
        slug
      }
      errors
    }
  }
`
