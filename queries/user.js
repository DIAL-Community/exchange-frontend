import { gql } from '@apollo/client'

export const USERS_LIST_QUERY = gql`
  query SearchUsers(
    $first: Int,
    $after: String,
    $search: String!
  ) {
    searchUsers(
      first: $first,
      after: $after,
      search: $search
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        email
        username
        roles
      }
    }
  }
`

export const USER_QUERY = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      id
      username
      confirmed
      email
      roles
      organization {
        id
        name
        slug
      }
      products {
        name
        slug
        imageFile
      }
      allRoles
    }
  }
`

export const USER_AUTHENTICATION_TOKEN_CHECK_QUERY = gql`
  query UserAuthenticationTokenCheck(
    $userId: Int!
    $userAuthenticationToken: String!
  ) {
    userAuthenticationTokenCheck(
      userId: $userId
      userAuthenticationToken: $userAuthenticationToken
    )
  }
`

export const USER_ROLES = gql`
  query UserRoles {
    userRoles
  }
`

export const USER_EMAIL_CHECK = gql`
  query UserEmailCheck ($email: String!) {
    userEmailCheck (email: $email)
  }
`
