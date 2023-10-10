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
      imageFile
      
      description
      parsedDescription

      resourceLink
      resourceType
      resourceTopic
    }
  }
`

export const CUSTOM_RESOURCE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeResource(
    $search: String
    $resourceType: String
    $resourceTopic: String
  ) {
    paginationAttributeResource(
      search: $search
      compartmentalized: true
      resourceType: $resourceType
      resourceTopic: $resourceTopic
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
    $resourceType: String
    $resourceTopic: String
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
    }
    paginatedResources(
      search: $search
      compartmentalized: true
      resourceType: $resourceType
      resourceTopic: $resourceTopic
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
      link
      imageFile
      
      description
      parsedDescription

      resourceLink
      resourceType
      resourceTopic
      
      showInExchange
      showInWizard
      
      featured
      spotlight
      
      organizations {
        id
        name
        slug
        imageFile
      }
    }
  }
`
