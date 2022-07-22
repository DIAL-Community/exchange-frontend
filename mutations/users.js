import { gql } from '@apollo/client'

export const UPDATE_USER = gql`
  mutation (
    $email: String!
    $roles: JSON!
    $products: JSON!
    $organizations: JSON!
    $username: String!
    $confirmed: Boolean
  ) {
    updateUser(
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
    }
  }
`
