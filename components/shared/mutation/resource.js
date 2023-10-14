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
    $publishedDate: ISO8601Date!
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
      publishedDate: $publishedDate
      organizationSlug: $organizationSlug
      authorName: $authorName
      authorEmail: $authorEmail
    ) {
      resource {
        id
        name
        slug
        description
        publishedDate

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

export const UPDATE_RESOURCE_TAGS = gql`
  mutation UpdateResourceTags(
    $slug: String!
    $tagNames: [String!]!
  ) {
    updateResourceTags(
      slug: $slug
      tagNames: $tagNames
    ) {
      resource {
        id
        name
        slug
        tags
      }
      errors
    }
  }
`

export const UPDATE_RESOURCE_COUNTRIES = gql`
  mutation UpdateResourceCountries(
    $slug: String!
    $countrySlugs: [String!]!
  ) {
    updateResourceCountries(
      slug: $slug
      countrySlugs: $countrySlugs
    ) {
      resource {
        id
        slug
        name
        countries {
          id
          name
          slug
          code
        }
      }
      errors
    }
  }
`
