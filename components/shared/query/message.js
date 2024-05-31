import { gql } from '@apollo/client'

export const MESSAGE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeMessage($search: String) {
    paginationAttributeMessage(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_MESSAGES_QUERY = gql`
  query PaginatedMessages(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedMessages(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      messageType
      messageDatetime
      parsedMessage
      createdAt
      createdBy {
        id
        username
        email
      }
    }
  }
`

export const MESSAGE_DETAIL_QUERY = gql`
  query Message($slug: String!) {
    message(slug: $slug) {
      id
      name
      slug
      messageType
      messageDatetime
      parsedMessage
      createdAt
      createdBy {
        id
        username
        email
      }
      location
      locationType
    }
  }
`
