import { gql } from '@apollo/client'

export const PROJECTS_MAP_QUERY = gql`
  query ProjectMap(
    $search: String
    $sectors: [String!]
    $tags: [String!]
    $products: [String!]
  ) {
    searchProjects(
      search: $search,
      sectors: $sectors,
      tags: $tags,
      products: $products
    ) {
      id
      name
      slug
      location
      latitude
      longitude
      countries {
        id
        name
        slug
        code
      }
    }
    countries(search: $search) {
      id
      name
      slug
      latitude
      longitude
    }
  }
`

export const COUNTRY_PROJECTS_QUERY = gql`
  query CountryMap(
    $search: String
    $sectors: [String!]
    $tags: [String!]
    $products: [String!]
    $country: String!
  ) {
    searchCountryProjects(
      search: $search,
      sectors: $sectors,
      tags: $tags,
      products: $products
      country: $country
    ) {
      id
      name
      slug
      location
      latitude
      longitude
    }
  }
`

export const ORGANIZATIONS_QUERY = gql`
  query SearchOrganizations(
    $sectors: [String!]
    $years: [Int!]
  ) {
    searchOrganizations(
      sectors: $sectors
      years: $years
    ) {
      id
      name
      slug
      website
      whenEndorsed
      countries {
        id
        name
        slug
        code
        latitude
        longitude
      }
      offices {
        id
        name
        latitude
        longitude
      }
    }
  }
`

export const AGGREGATORS_MAP_QUERY = gql`
  query SearchOrganizations(
    $aggregatorOnly: Boolean
    $aggregators: [String!]
    $capabilities: [String!]
    $operators: [String!]
    $services: [String!]
  ) {
    searchOrganizations(
      aggregatorOnly: $aggregatorOnly
      aggregators: $aggregators
    ) {
      id
      name
      slug
      website
      whenEndorsed
      countries {
        id
        name
        slug
        code
        latitude
        longitude
      }
      offices {
        id
        name
        latitude
        longitude
      }
    }
    countries {
      id
      name
      slug
      latitude
      longitude
    }
    capabilities(
      capabilities: $capabilities
      services: $services
    ) {
      service
      capability
      countryId
      aggregatorId
      operatorServiceId
    }
    operatorServices(operators: $operators) {
      id
      name
      countryId
    }
  }
`
