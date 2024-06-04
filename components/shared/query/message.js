import { gql } from '@apollo/client'

export const MESSAGE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeMessage(
    $search: String
    $messageType: String
    $visibleOnly: Boolean
  ) {
    paginationAttributeMessage(
      search: $search
      messageType: $messageType
      visibleOnly: $visibleOnly
    ) {
      totalCount
    }
  }
`

export const PAGINATED_MESSAGES_QUERY = gql`
  query PaginatedMessages(
    $search: String
    $messageType: String
    $visibleOnly: Boolean
    $limit: Int!
    $offset: Int!
  ) {
    paginatedMessages(
      search: $search
      messageType: $messageType
      visibleOnly: $visibleOnly
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      messageType
      messageTemplate
      messageDatetime
      parsedMessage
      visible
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
      messageTemplate
      messageDatetime
      parsedMessage
      visible
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
