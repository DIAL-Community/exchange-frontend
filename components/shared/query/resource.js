import { gql } from '@apollo/client'

export const RESOURCE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeResource(
    $search: String
    $tags: [String!]
    $countries: [String!]
    $resourceTypes: [String!]
    $resourceTopics: [String!]
    $compartmentalized: Boolean
  ) {
    paginationAttributeResource(
      search: $search
      countries: $countries
      compartmentalized: $compartmentalized
      resourceTypes: $resourceTypes
      resourceTopics: $resourceTopics
      tags: $tags
    ) {
      totalCount
    }
  }
`

export const FEATURED_RESOURCES_QUERY = gql`
  query PaginatedResources(
    $limit: Int!
    $offset: Int!
    $compartmentalized: Boolean
  ) {
    featuredResources: paginatedResources(
      featuredLength: 3
      featuredOnly: true
      compartmentalized: $compartmentalized
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

export const PAGINATED_RESOURCES_QUERY = gql`
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

      buildingBlocks {
        id
        name
        slug
        imageFile
        maturity
        category
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

      useCases {
        id
        name
        slug
        imageFile
      }
    }
  }
`
