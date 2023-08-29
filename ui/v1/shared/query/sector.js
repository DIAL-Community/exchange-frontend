import { gql } from '@apollo/client'

export const SECTOR_SEARCH_QUERY = gql`
  query Sectors($search: String, $locale: String) {
    sectors(search: $search, locale: $locale) {
      id
      name
      slug
    }
  }
`

export const SECTOR_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeSector($search: String) {
    paginationAttributeSector(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_SECTORS_QUERY = gql`
  query PaginatedSectors(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedSectors(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      datasets {
        id
      }
      products {
        id
      }
      projects {
        id
      }
      organizations {
        id
      }
    }
  }
`

export const SECTOR_DETAIL_QUERY = gql`
  query Sector($slug: String!) {
    sector(slug: $slug) {
      id
      name
      slug
      datasets {
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
      projects {
        id
        name
        slug
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
