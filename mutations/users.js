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
          name
          slug
        }
        organization {
          name
          slug
        }
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
        email
        roles
        description
        productId
        organizationId
      }
      errors
    }
  }
`
