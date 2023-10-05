import { gql } from '@apollo/client'

export const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id) {
      resource {
        id
        slug
        name
      }
      errors
    }
  }
`

export const CREATE_RESOURCE = gql`
  mutation CreateResource(
    $name: String!
    $slug: String!
    $imageFile: Upload
    $description: String
    $resourceLink: String
    $resourceType: String
    $resourceTopic: String
    $showInExchange: Boolean
    $showInWizard: Boolean
    $organizationSlug: String
  ) {
    createResource(
      name: $name
      slug: $slug
      imageFile: $imageFile
      description: $description
      resourceLink: $resourceLink
      resourceType: $resourceType
      resourceTopic: $resourceTopic
      showInExchange: $showInExchange
      showInWizard: $showInWizard
      organizationSlug: $organizationSlug
    ) {
      resource {
        id
        name
        slug
        description
        resourceLink
        resourceType
        resourceTopic
      }
      errors
    }
  }
`
