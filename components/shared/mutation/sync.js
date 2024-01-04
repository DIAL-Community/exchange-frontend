import { gql } from '@apollo/client'

export const DELETE_SYNC = gql`
  mutation DeleteSync($id: ID!) {
    deleteSync(id: $id) {
      sync {
        id
        slug
        name
      }
      errors
    }
  }
`

export const CREATE_SYNC = gql`
  mutation CreateSync(
    $name: String!
    $slug: String!
    $description: String!
    $source: String!
    $destination: String!
  ) {
    createSync(
      name: $name
      slug: $slug
      description: $description
      source: $source
      destination: $destination
    ) {
      sync {
        id
        name
        slug
        description
        tenantSource
        tenantDestination
      }
      errors
    }
  }
`
