import { gql } from '@apollo/client'

export const DELETE_RESOURCE_TOPIC = gql`
  mutation DeleteResourceTopic($id: ID!) {
    deleteResourceTopic(id: $id) {
      resourceTopic {
        id
      }
      errors
    }
  }
`

export const CREATE_RESOURCE_TOPIC = gql`
  mutation CreateResourceTopic(
    $name: String!
    $slug: String!
    $description: String
  ) {
    createResourceTopic(
      name: $name
      slug: $slug
      description: $description
    ) {
      resourceTopic {
        id
        name
        slug
        resourceTopicDescription {
          id
          description
          locale
        }
      }
      errors
    }
  }
`
