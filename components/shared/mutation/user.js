import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation (
    $email: String!
    $roles: JSON!
    $products: JSON!
    $organizations: JSON!
    $username: String!
    $confirmed: Boolean
  ) {
    createUser(
      email: $email
      roles: $roles
      products: $products
      organizations: $organizations
      username: $username
      confirmed: $confirmed
    ) {
      user {
        id
        email
        username
        roles
        products {
          id
          name
          slug
        }
        organization {
          id
          name
          slug
        }
      }
      errors
    }
  }
`

export const CREATE_ADLI_USER = gql`
  mutation (
    $email: String!
    $roles: JSON!
    $username: String!
    $confirmed: Boolean
  ) {
    createAdliUser(
      email: $email
      roles: $roles
      username: $username
      confirmed: $confirmed
    ) {
      user {
        id
        email
        username
        roles
      }
      errors
    }
  }
`

export const APPLY_AS_OWNER = gql`
  mutation ApplyAsOwner(
    $entity: String!
    $entityId: Int!
  ) {
    applyAsOwner(
      entity: $entity
      entityId: $entityId
    ) {
      candidateRole {
        id
        email
        roles
        description
        productId
        organizationId
        datasetId
      }
      errors
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      user {
       id
       email
      }
      errors
    }
  }
`
