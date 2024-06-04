import { gql } from '@apollo/client'

export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      message {
        id
        slug
        name
      }
      errors
    }
  }
`

export const UPDATE_MESSAGE_VISIBILITY = gql`
  mutation UpdateMessageVisibility($slug: String!, $visibility: Boolean!) {
    updateMessageVisibility(slug: $slug, visibility: $visibility) {
      message {
        id
        slug
        name
        visible
      }
      errors
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation CreateMessage(
    $name: String!
    $messageType: String!
    $messageTemplate: String!
    $messageDatetime: ISO8601Date!
    $visible: Boolean
    $location: String
    $locationType: String
  ) {
    createMessage(
      name: $name
      messageType: $messageType
      messageTemplate: $messageTemplate
      messageDatetime: $messageDatetime
      visible: $visible
      location: $location
      locationType: $locationType
    ) {
      message {
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
      errors
    }
  }
`
