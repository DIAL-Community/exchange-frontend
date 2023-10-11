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
    $featured: Boolean
    $spotlight: Boolean
    $resourceLink: String
    $resourceType: String
    $resourceTopic: String
    $showInExchange: Boolean
    $showInWizard: Boolean
    $organizationSlug: String
    $authorName: String!
    $authorEmail: String
  ) {
    createResource(
      name: $name
      slug: $slug
      imageFile: $imageFile
      description: $description
      featured: $featured
      spotlight: $spotlight
      resourceLink: $resourceLink
      resourceType: $resourceType
      resourceTopic: $resourceTopic
      showInExchange: $showInExchange
      showInWizard: $showInWizard
      organizationSlug: $organizationSlug
      authorName: $authorName
      authorEmail: $authorEmail
    ) {
      resource {
        id
        name
        slug
        description

        featured
        spotlight

        resourceLink
        resourceType
        resourceTopic

        authors {
          name
        }
      }
      errors
    }
  }
`
