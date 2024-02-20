import { gql } from '@apollo/client'

export const RESOURCE_TOPIC_SEARCH_QUERY = gql`
  query ResourceTopics($search: String) {
    resourceTopics(search: $search) {
      id
      name
      slug
    }
  }
`

export const RESOURCE_TOPIC_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeResourceTopic($search: String) {
    paginationAttributeResourceTopic(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_RESOURCE_TOPICS_QUERY = gql`
  query PaginatedResourceTopics(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedResourceTopics(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      resourceTopicDescription {
        id
        description
        locale
      }
      resources {
        id
      }
    }
  }
`

export const RESOURCE_TOPIC_DETAIL_QUERY = gql`
  query ResourceTopic($slug: String!) {
    resourceTopic(slug: $slug) {
      id
      name
      slug
      resourceTopicDescription {
        id
        description
        locale
      }
      resources {
        id
        name
        slug
        imageFile
      }
    }
  }
`
