import { gql } from '@apollo/client'

export const DATASET_QUERY = gql`
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

export const DATASET_SEARCH_QUERY = gql`
  query Datasets($search: String!) {
    datasets(search: $search) {
      id
      name
      slug
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

export const DATASETS_QUERY = gql`
  query SearchDatasets(
    $first: Int,
    $after: String,
    $origins: [String!],
    $sectors: [String!],
    $countries: [String!],
    $organizations: [String!],
    $sdgs: [String!],
    $tags: [String!],
    $datasetTypes: [String!],
    $search: String!
  ) {
    searchDatasets(
      first: $first,
      after: $after,
      origins: $origins,
      sectors: $sectors,
      countries: $countries,
      organizations: $organizations,
      sdgs: $sdgs,
      tags: $tags,
      datasetTypes: $datasetTypes,
      search: $search
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
        datasetType
        tags
        origins{
          name
          slug
        }
        sustainableDevelopmentGoals {
          slug
          name
        }
        datasetDescription {
          description
          locale
        }
      }
    }
  }
`
