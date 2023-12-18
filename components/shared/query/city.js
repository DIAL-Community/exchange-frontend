import { gql } from '@apollo/client'

export const CITY_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCity($search: String) {
    paginationAttributeCity(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_CITIES_QUERY = gql`
  query PaginatedCities(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCities(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      province {
        id
        name
        slug
        country {
          id
          name
          slug
          code
        }
      }
      organizations {
        id
      }
    }
  }
`

export const CITY_DETAIL_QUERY = gql`
  query City($slug: String!) {
    city(slug: $slug) {
      id
      name
      slug
      latitude
      longitude
      province {
        id
        name
        slug
        country {
          id
          name
          slug
          code
        }
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
