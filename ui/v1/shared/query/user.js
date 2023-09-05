import { gql } from '@apollo/client'

export const USER_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeUser($search: String) {
    paginationAttributeUser(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_USERS_QUERY = gql`
  query PaginatedUsers(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedUsers(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      email
      roles
      username
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

export const USER_DETAIL_QUERY = gql`
  query User($userId: String!) {
    user(userId: $userId) {
      id
      email
      roles
      username
      confirmed
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
