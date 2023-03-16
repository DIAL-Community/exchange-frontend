import { gql } from '@apollo/client'

export const WIZARD_QUERY = gql`
  query Wizard(
    $sectors: [String!]
    $useCase: String
    $sdgs: [String!]
    $buildingBlocks: [String!]
  ) {
    wizard(
      sectors: $sectors
      useCase: $useCase
      sdgs: $sdgs
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
  query UseCasesForSector ($sectorsSlugs: [String!]!) {
    useCasesForSector (sectorsSlugs: $sectorsSlugs) {
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

export const WIZARD_PAGINATED_PLAYBOOKS = gql`
  query PaginatedPlaybooks(
    $first: Int!
    $offset: Int!
    $sectors: [String!]
    $tags: [String!]
    $playbookSortHint: String!
  ) {
    paginatedPlaybooks(
      first: $first
      offsetAttributes: { offset: $offset }
      sectors: $sectors
      tags: $tags
      playbookSortHint: $playbookSortHint
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
        tags
      }
    }
  }
`

export const WIZARD_PAGINATED_DATASETS = gql`
  query PaginatedDatasets (
    $first: Int!
    $offset: Int!
    $sectors: [String!]
    $tags: [String!]
    $datasetSortHint: String!
  ) {
    paginatedDatasets (
      first: $first
      offsetAttributes: { offset: $offset }
      sectors: $sectors
      tags: $tags
      datasetSortHint: $datasetSortHint
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
        origins {
          name
          slug
        }
        datasetType
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

export const WIZARD_PARAMS_QUERY = gql`
  query WizardParamsQuery($locale: String) {
    tags {
      id
      name
      slug
    }
    countries {
      id
      name
      slug
    }
    sdgs {
      id
      name
      slug
    }
    sectors(locale: $locale) {
      id
      name
      slug
    }
    buildingBlocks {
      id
      name
      slug
      imageFile
      maturity
    }
  }
`
