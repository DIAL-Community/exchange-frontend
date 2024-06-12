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
    $imageFile: Upload
    $description: String
    $parentTopicId: ID
  ) {
    createResourceTopic(
      name: $name
      slug: $slug
      imageFile: $imageFile
      description: $description
      parentTopicId: $parentTopicId
    ) {
      resourceTopic {
        id
        name
        slug
        imageFile
        parentTopic {
          id
          name
          slug
        }
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
