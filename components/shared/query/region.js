import { gql } from '@apollo/client'

export const REGION_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeRegion($search: String) {
    paginationAttributeRegion(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_REGIONS_QUERY = gql`
  query PaginatedRegions(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedRegions(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      description
      countries {
        id
      }
    }
  }
`

export const REGION_DETAIL_QUERY = gql`
  query Region($slug: String!) {
    region(slug: $slug) {
      id
      name
      slug
      description
      countries {
        id
        name
        slug
        code
      }
    }
  }
`
