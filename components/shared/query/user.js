import { gql } from '@apollo/client'

export const USER_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeUser($search: String, $roles: [String!]) {
    paginationAttributeUser(search: $search,  roles: $roles) {
      totalCount
    }
  }
`

export const PAGINATED_DPI_USERS_QUERY = gql`
  query PaginatedUsers(
    $search: String
    $roles: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedUsers(
      roles: $roles
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      email
      roles
      username
      confirmedAt
    }
  }
`

export const PAGINATED_USERS_QUERY = gql`
  query PaginatedUsers(
    $search: String
    $roles: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedUsers(
      roles: $roles
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      email
      roles
      username
      confirmedAt
      organization {
        id
        name
        slug
        imageFile
      }
      products {
        id
        name
        slug
        imageFile
      }
    }
  }
`

export const SIMPLE_USER_DETAIL_QUERY = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      id
      email
      roles
      username
      createdAt
      confirmed
      confirmedAt
    }
  }
`

export const USER_DETAIL_QUERY = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      id
      email
      roles
      username
      createdAt
      confirmed
      confirmedAt
      organization {
        id
        name
        slug
        imageFile
      }
      products {
        id
        name
        slug
        imageFile
      }
    }
  }
`

export const USER_SEARCH_QUERY = gql`
  query Users($search: String) {
    products(search: $search) {
      id
      email
      username
    }
  }
`

export const USER_FORM_SELECTION_QUERY = gql`
  query UserFormSelectionQuery {
    organizations {
      id
      name
      slug
      website
    }
    userRoles
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

export const USER_EMAIL_CHECK = gql`
  query UserEmailCheck ($email: String!) {
    userEmailCheck (email: $email)
  }
`
