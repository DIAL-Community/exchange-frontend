import { gql } from '@apollo/client'

export const TAG_SEARCH_QUERY = gql`
  query Tags($search: String) {
    tags(search: $search) {
      id
      name
      slug
    }
  }
`

export const TAG_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeTag($search: String) {
    paginationAttributeTag(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_TAGS_QUERY = gql`
  query PaginatedTags(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedTags(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      tagDescription {
        id
        description
        locale
      }
    }
  }
`

export const TAG_DETAIL_QUERY = gql`
  query Tag($slug: String!) {
    tag(slug: $slug) {
      id
      name
      slug
      tagDescription {
        id
        description
        locale
      }
    }
  }
`
