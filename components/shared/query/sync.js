import { gql } from '@apollo/client'

export const CONTACT_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeSync($search: String) {
    paginationAttributeSync(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_CONTACTS_QUERY = gql`
  query PaginatedSyncs(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedSyncs(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      email
      title
      organizations {
        id
      }
    }
  }
`

export const CONTACT_DETAIL_QUERY = gql`
  query Sync($slug: String!) {
    sync(slug: $slug) {
      id
      name
      slug
      email
      title
      organizations {
        id
        name
        slug
        imageFile
      }
    }
  }
`
