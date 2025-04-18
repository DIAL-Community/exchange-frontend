import { gql } from '@apollo/client'

export const COUNTRY_SEARCH_QUERY = gql`
  query Countries($search: String) {
    countries(search: $search) {
      id
      name
      slug
      code
    }
  }
`

export const COUNTRIES_WITH_RESOURCES_SEARCH_QUERY = gql`
  query CountriesWithResources($search: String) {
    countries: countriesWithResources(search: $search) {
      id
      name
      slug
      code
      description
    }
  }
`

export const COUNTRY_CODES_QUERY = gql`
  query Countries($search: String!) {
    countries(search: $search) {
      codeLonger
    }
  }
`

export const COUNTRY_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeCountry($search: String) {
    paginationAttributeCountry(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_COUNTRIES_QUERY = gql`
  query PaginatedCountries(
    $search: String
    $limit: Int!
    $offset: Int!
  ) {
    paginatedCountries(
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      code
      codeLonger
      organizations {
        id
      }
      projects {
        id
      }
    }
  }
`

export const COUNTRY_POLICY_QUERY = gql`
  query Country($slug: String!) {
    country(slug: $slug) {
      id
    }
  }
`

export const COUNTRY_DETAIL_QUERY = gql`
  query Country($slug: String!) {
    country(slug: $slug) {
      id
      name
      slug
      code
      codeLonger
      latitude
      longitude
      description
      organizations {
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
    }
  }
`

export const DPI_COUNTRY_DETAIL_QUERY =  gql`
query Country($slug: String!) {
  country(slug: $slug) {
    id
    name
    slug
    code
    codeLonger
    latitude
    longitude
    description
    resources {
      id
      name
      slug
      imageFile
      parsedDescription
    }
    products {
      id
      name
      slug
      imageFile
    }
    dpiProducts {
      id
      name
      slug
      imageFile
    }
  }
}
`
