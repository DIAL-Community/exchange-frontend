import { gql } from '@apollo/client'

export const DATASET_SEARCH_QUERY = gql`
  query Datasets($search: String) {
    datasets(search: $search) {
      id
      name
      slug
    }
  }
`

export const DATASET_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeDataset(
    $search: String
    $sectors: [String!]
    $sdgs: [String!]
    $tags: [String!]
    $origins: [String!]
    $datasetTypes: [String!]
    $countries: [String!]
  ) {
    paginationAttributeDataset(
      search: $search
      sectors: $sectors
      sdgs: $sdgs
      tags: $tags
      origins: $origins
      datasetTypes: $datasetTypes
      countries: $countries
    ) {
      totalCount
    }
  }
`

export const PAGINATED_DATASETS_QUERY = gql`
  query PaginatedDatasets(
    $search: String
    $sectors: [String!]
    $sdgs: [String!]
    $tags: [String!]
    $origins: [String!]
    $datasetTypes: [String!]
    $countries: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedDatasets(
      search: $search
      sectors: $sectors
      sdgs: $sdgs
      tags: $tags
      origins: $origins
      datasetTypes: $datasetTypes
      countries: $countries
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      tags
      imageFile
      parsedDescription
      datasetDescription {
        id
        description
        locale
      }
      sdgs {
        id
      }
      sectors {
        id
      }
    }
  }
`

export const DATASET_DETAIL_QUERY = gql`
  query Dataset($slug: String!) {
    dataset(slug: $slug) {
      id
      name
      slug
      imageFile
      website
      visualizationUrl
      geographicCoverage
      timeRange
      license
      languages
      datasetType
      dataFormat
      tags
      datasetDescription {
        id
        description
        locale
      }
      countries {
        id
        name
        slug
        code
      }
      origins {
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
      sdgsMapping
      sdgs {
        id
        name
        slug
        imageFile
      }
      sectors {
        id
        name
        slug
        isDisplayable
      }
      countries {
        id
        name
        slug
        code
      }
      manualUpdate
    }
  }
`

export const OWNED_DATASETS_QUERY = gql`
  query OwnedDatasets {
    ownedDatasets {
      id
      name
      slug
    }
  }
`
