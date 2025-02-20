import { gql } from '@apollo/client'

export const PROJECTS_QUERY = gql`
  query SearchProjects(
    $first: Int,
    $sectors: [String!]
    $tags: [String!]
    $products: [String!]
  ) {
    searchProjects(
      first: $first,
      sectors: $sectors,
      tags: $tags,
      products: $products
    ) {
      id
      name
      slug
      countries {
        id
        name
        slug
        code
      }
    }
  }
`

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

export const PRODUCTS_QUERY = gql`
  query SearchProducts(
    $first: Int,
    $countries: [String!]
    $products: [String!]
    ) {
    searchProducts(
      first: $first,
      countries: $countries,
      products: $products
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
        id
        name
        slug
        countries {
          id
          name
          slug
          code
        }
      }
    }
  }
`

export const ORGANIZATIONS_QUERY = gql`
  query SearchOrganizations(
    $first: Int
    $sectors: [String!]
    $years: [Int!]
  ) {
    searchOrganizations(
      first: $first
      sectors: $sectors
      years: $years
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
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
  }
`

export const AGGREGATORS_QUERY = gql`
  query SearchOrganizations(
    $first: Int
    $aggregatorOnly: Boolean
    $aggregators: [String!]
  ) {
    searchOrganizations(
      first: $first
      aggregatorOnly: $aggregatorOnly
      aggregators: $aggregators
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
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
  }
`

export const AGGREGATORS_MAP_QUERY = gql`
  query SearchOrganizations(
    $first: Int
    $aggregatorOnly: Boolean
    $aggregators: [String!]
    $capabilities: [String!]
    $operators: [String!]
    $services: [String!]
  ) {
    searchOrganizations(
      first: $first
      aggregatorOnly: $aggregatorOnly
      aggregators: $aggregators
    ) {
      totalCount
      pageInfo {
        endCursor
        startCursor
        hasPreviousPage
        hasNextPage
      }
      nodes {
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
    operatorServices(
      operators: $operators
    ) {
      id
      name
      countryId
    }
  }
`

export const COUNTRIES_QUERY = gql`
  query Countries($search: String) {
    countries(search: $search) {
      id
      name
      slug
      latitude
      longitude
    }
  }
`

export const CAPABILITIES_QUERY = gql`
  query Capabilities(
    $search: String,
    $capabilities: [String!],
    $services: [String!]
  ) {
    capabilities(
      search: $search,
      capabilities: $capabilities,
      services: $services
    ) {
      service
      capability
      countryId
      aggregatorId
      operatorServiceId
    }
  }
`

export const OPERATORS_QUERY = gql`
  query OperatorServices(
    $search: String,
    $operators: [String!]
  ) {
    operatorServices(
      search: $search,
      operators: $operators
    ) {
      id
      name
      countryId
    }
  }
`
