import { gql } from '@apollo/client'

export const RESOURCE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeResource($search: String) {
    paginationAttributeResource(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_RESOURCES_QUERY = gql`
  query PaginatedResources(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedResources(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      tags
      imageFile
      
      description
      parsedDescription

      resourceLink
      resourceType
      resourceTopic

      publishedDate

      authors {
        name
      }
    }
  }
`

export const CUSTOM_RESOURCE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeResource(
    $search: String
    $resourceTypes: [String!]
    $resourceTopics: [String!]
  ) {
    paginationAttributeResource(
      search: $search
      compartmentalized: true
      resourceTypes: $resourceTypes
      resourceTopics: $resourceTopics
    ) {
      totalCount
    }
  }
`

export const CUSTOM_PAGINATED_RESOURCES_QUERY =  gql`
  query PaginatedResources(
    $limit: Int!
    $offset: Int!
    $search: String
    $resourceTypes: [String!]
    $resourceTopics: [String!]
  ) {
    spotlightResources: paginatedResources(
      spotlightLength: 1
      spotlightOnly: true
      compartmentalized: true
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      
      description
      parsedDescription

      resourceLink
      resourceType
      resourceTopic

      publishedDate

      authors {
        name
      }
    }
    featuredResources: paginatedResources(
      featuredLength: 3
      featuredOnly: true
      compartmentalized: true
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      
      description
      parsedDescription

      resourceLink
      resourceType
      resourceTopic

      publishedDate

      authors {
        name
      }
    }
    paginatedResources(
      search: $search
      compartmentalized: true
      resourceTypes: $resourceTypes
      resourceTopics: $resourceTopics
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      
      description
      parsedDescription

      resourceLink
      resourceType
      resourceTopic

      publishedDate

      authors {
        name
      }
    }
  }
`

export const RESOURCE_SEARCH_QUERY = gql`
  query Resources($search: String!) {
    resources(search: $search) {
      id
      name
      slug
    }
  }
`

export const RESOURCE_DETAIL_QUERY = gql`
  query Resource($slug: String!) {
    resource(slug: $slug) {
      id
      name
      slug
      tags
      imageFile
      publishedDate
      
      description
      parsedDescription

      resourceLink
      resourceType
      resourceTopic
      
      showInExchange
      showInWizard
      
      featured
      spotlight

      authors {
        name
      }

      countries {
        id
        name
        slug
        code
      }
      
      organizations {
        id
        name
        slug
        imageFile
      }
    }
  }
`
