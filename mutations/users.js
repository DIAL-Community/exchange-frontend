import { gql } from '@apollo/client'

export const UPDATE_USER = gql`
mutation ($email: String!, $roles: JSON!, $products: JSON!, $organizations: JSON!, $username: String!) {
  updateUser(email: $email, roles: $roles, products: $products, organizations: $organizations, username: $username) {
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
