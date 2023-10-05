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
    $slug: String!
    $name: String!
    $imageFile: Upload
    $description: String
    $resourceLink: String
    $resourceType: String
    $resourceTopic: String
    $showInWizard: Boolean
    $showInExchange: Boolean
    $featured: Boolean
    $spotlight: Boolean
    $organizationSlug: String
  ) {
    createResource(
      slug: $slug
      name: $name
      imageFile: $imageFile
      description: $description
      resourceLink: $resourceLink
      resourceType: $resourceType
      resourceTopic: $resourceTopic
      showInWizard: $showInWizard
      showInExchange: $showInExchange
      featured: $featured
      spotlight: $spotlight
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
