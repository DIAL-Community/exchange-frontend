import { gql } from '@apollo/client'

export const SYNC_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeSync($search: String) {
    paginationAttributeSync(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_SYNCS_QUERY = gql`
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
      description
      tenantSource
      tenantDestination
      syncConfiguration
    }
  }
`

export const SYNC_DETAIL_QUERY = gql`
  query Sync($slug: String!) {
    sync(slug: $slug) {
      id
      name
      slug
      description
      tenantSource
      tenantDestination
      syncConfiguration
    }
  }
`
