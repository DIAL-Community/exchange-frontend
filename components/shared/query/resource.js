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
    $limit: Int!
    $offset: Int!
    $search: String
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
      linkDescription
      resourceType
      resourceTopics {
        id
        name
        slug
      }

      publishedDate

      authors {
        id
        name
        slug
      }
    }
  }
`

export const CUSTOM_RESOURCE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeResource(
    $search: String
    $countries: [String!]
    $resourceTypes: [String!]
    $resourceTopics: [String!]
    $tags: [String!]
  ) {
    paginationAttributeResource(
      search: $search
      countries: $countries
      compartmentalized: true
      resourceTypes: $resourceTypes
      resourceTopics: $resourceTopics
      tags: $tags
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
    $tags: [String!]
    $countries: [String!]
    $resourceTypes: [String!]
    $resourceTopics: [String!]
    $compartmentalized: Boolean
  ) {
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
      linkDescription
      resourceType

      resourceTopics {
        id
        name
        slug
      }

      publishedDate

      products {
        id
      }

      authors {
        id
        name
        slug
      }
      tags
    }
    paginatedResources(
      search: $search
      tags: $tags
      countries: $countries
      compartmentalized: $compartmentalized
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
      linkDescription
      resourceType

      resourceTopics {
        id
        name
        slug
      }

      publishedDate

      products {
        id
      }

      authors {
        id
        name
        slug
      }
      tags
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

      resourceFile
      resourceLink
      linkDescription

      source {
        id
        name
        slug
        imageFile
      }
      resourceType
      resourceTopics {
        id
        slug
        name
      }
      
      showInExchange
      showInWizard
      
      featured

      authors {
        id
        slug
        name
        email
        picture
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

      products {
        id
        name
        slug
        imageFile
      }
    }
  }
`
