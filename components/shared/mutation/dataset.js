import { gql } from '@apollo/client'

export const CREATE_DATASET = gql`
  mutation CreateDataset (
    $name: String!
    $slug: String!
    $aliases: JSON
    $website: String
    $visualizationUrl: String
    $geographicCoverage: String
    $timeRange: String
    $datasetType: String!
    $license: String
    $languages: String
    $dataFormat: String
    $description: String!
    $imageFile: Upload
  ) {
    createDataset (
      name: $name
      slug: $slug
      aliases: $aliases
      website: $website
      visualizationUrl: $visualizationUrl
      geographicCoverage: $geographicCoverage
      timeRange: $timeRange
      datasetType: $datasetType
      license: $license
      languages: $languages
      dataFormat: $dataFormat
      description: $description
      imageFile: $imageFile
    ) {
      dataset {
        id
        name
        slug
        website
        datasetDescription {
          description
          locale
        }
      }
      errors
    }
  }
`

export const UPDATE_DATASET_COUNTRIES = gql`
  mutation UpdateDatasetCountries(
    $slug: String!
    $countrySlugs: [String!]!
  ) {
    updateDatasetCountries(
      slug: $slug
      countrySlugs: $countrySlugs
    ) {
      dataset {
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
      errors
    }
  }
`

export const UPDATE_DATASET_SDGS = gql`
  mutation UpdateDatasetSdgs(
    $slug: String!
    $mappingStatus: String!
    $sdgSlugs: [String!]!
  ) {
    updateDatasetSdgs(
      slug: $slug
      mappingStatus: $mappingStatus
      sdgSlugs: $sdgSlugs
    ) {
      dataset {
        id
        name
        slug
        sdgs {
          id
          name
          imageFile
          slug
        }
        sdgsMapping
      }
      errors
    }
  }
`

export const UPDATE_DATASET_ORGANIZATIONS = gql`
  mutation UpdateDatasetOrganizations(
    $slug: String!
    $organizationSlugs: [String!]!
  ) {
    updateDatasetOrganizations(
      slug: $slug
      organizationSlugs: $organizationSlugs
    ) {
      dataset {
        id
        name
        slug
        organizations {
          id
          name
          imageFile
          slug
        }
      }
      errors
    }
  }
`

export const UPDATE_DATASET_SECTORS = gql`
  mutation UpdateDatasetSectors(
    $slug: String!
    $sectorSlugs: [String!]!
  ) {
    updateDatasetSectors(
      slug: $slug
      sectorSlugs: $sectorSlugs
    ) {
      dataset {
        id
        name
        slug
        sectors {
          id
          name
          slug
        }
      }
      errors
    }
  }
`

export const UPDATE_DATASET_TAGS = gql`
  mutation UpdateDatasetTags(
    $slug: String!
    $tagNames: [String!]!
  ) {
    updateDatasetTags(
      slug: $slug
      tagNames: $tagNames
    ) {
      dataset {
        id
        name
        slug
        tags
      }
      errors
    }
  }
`

export const DELETE_DATASET = gql`
  mutation DeleteDataset($id: ID!) {
    deleteDataset(id: $id) {
      dataset {
        id
        slug
        name
      }
      errors
    }
  }
`
