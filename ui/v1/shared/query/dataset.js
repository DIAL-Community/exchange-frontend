import { gql } from '@apollo/client'

export const DATASET_SEARCH_QUERY = gql`
  query Datasets($search: String!) {
    datasets(search: $search) {
      id
      name
      slug
    }
  }
`

export const DATASET_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeDataset(
    $sectors: [String!]
    $search: String!
  ) {
    paginationAttributeDataset(
      sectors: $sectors
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_DATASETS_QUERY = gql`
  query PaginatedDatasetsRedux(
    $sectors: [String!]
    $search: String!
    $limit: Int!
    $offset: Int!
  ) {
    paginatedDatasetsRedux(
      sectors: $sectors
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      datasetDescription {
        id
        description
        locale
      }
      sustainableDevelopmentGoals {
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
        description
        locale
      }
      origins {
        name
        slug
      }
      organizations {
        name
        slug
        imageFile
        isEndorser
        whenEndorsed
      }
      sustainableDevelopmentGoalMapping
      sustainableDevelopmentGoals {
        id
        name
        slug
        imageFile
      }
      sectors {
        name
        slug
        isDisplayable
      }
      countries {
        name
        slug
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