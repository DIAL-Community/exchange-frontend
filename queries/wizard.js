import { gql } from '@apollo/client'

export const WIZARD_QUERY = gql`
  query Wizard(
    $sector: String
    $useCase: String
    $sdg: String
    $buildingBlocks: [String!]
  ) {
    wizard(
      sector: $sector
      useCase: $useCase
      sdg: $sdg
      buildingBlocks: $buildingBlocks
    ) {
      digitalPrinciples {
        phase
        name
        slug
        url
      }
      useCases {
        name
        imageFile
        maturity
        slug
        useCaseDescription {
          description
        }
      }
      buildingBlocks {
        name
        imageFile
        maturity
        slug
      }
      useCases {
        name
      }
      resources {
        phase
        name
        imageUrl
        link
        description
      }
    }
  }
`

export const WIZARD_USE_CASES_FOR_SECTOR = gql`
  query UseCasesForSector ($sectorSlug: String!) {
    useCasesForSector (sectorSlug: $sectorSlug) {
      name
    }
  }
`

export const WIZARD_PAGINATED_PRODUCTS = gql`
  query PaginatedProducts(
    $first: Int!
    $offset: Int!
    $buildingBlocks: [String!]
    $countries: [String!]
    $sectors: [String!]
    $useCases: [String!]
    $tags: [String!]
    $productSortHint: String!
    $commercialProduct: Boolean
  ) {
    paginatedProducts(
      first: $first
      offsetAttributes: { offset: $offset}
      buildingBlocks: $buildingBlocks
      countries: $countries
      sectors: $sectors
      useCases: $useCases
      tags: $tags
      productSortHint: $productSortHint
      commercialProduct: $commercialProduct
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
        imageFile
        website
        endorsers {
          name
          slug
        }
        origins {
          name
          slug
        }
        isLaunchable
        commercialProduct
        mainRepository {
          license
        }
      }
    }
  }
`

export const WIZARD_PAGINATED_PROJECTS = gql`
  query PaginatedProjects(
    $first: Int!
    $offset: Int!
    $sectors: [String!]
    $countries: [String!]
    $tags: [String!]
    $projectSortHint: String!
  ) {
    paginatedProjects(
      first: $first
      offsetAttributes: { offset: $offset}
      sectors: $sectors
      countries: $countries
      tags: $tags
      projectSortHint: $projectSortHint
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
        organizations {
          id
          slug
          name
          imageFile
        }
        products {
          id
          slug
          name
          imageFile
        }
        origin {
          slug
          name
        }
      }
    }
  }
`

export const WIZARD_SDG_QUERY = gql`
  query SDGs {
    sdgs {
      id
      name
      slug
    }
  }
`

export const WIZARD_COUNTRY_QUERY = gql`
  query Countries {
    countries {
      id
      name
      slug
    }
  }
`

export const WIZARD_TAG_QUERY = gql`
  query Tags {
    tags {
      id
      name
      slug
    }
  }
`
