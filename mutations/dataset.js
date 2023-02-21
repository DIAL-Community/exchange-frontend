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
        name
        slug
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
        countries {
          id
          name
          slug
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
        sustainableDevelopmentGoals {
          id
          name
          imageFile
          slug
        }
        sustainableDevelopmentGoalMapping
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
        tags
      }
      errors
    }
  }
`

export const CREATE_CANDIDATE_DATASET = gql`
  mutation CreateCandidateDataset(
    $name: String!
    $slug: String!
    $dataUrl: String!
    $dataVisualizationUrl: String
    $dataType: String!
    $submitterEmail: String!
    $description: String!
    $captcha: String!
  ) {
    createCandidateDataset (
      name: $name
      slug: $slug
      dataUrl: $dataUrl
      dataVisualizationUrl: $dataVisualizationUrl
      dataType: $dataType
      submitterEmail: $submitterEmail
      description: $description
      captcha: $captcha
    ) {
      candidateDataset {
        name
        slug
        dataUrl
        dataVisualizationUrl
        description
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
