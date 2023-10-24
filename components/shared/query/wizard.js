import { gql } from '@apollo/client'

export const WIZARD_BUILDING_BLOCKS_QUERY = gql`
  query WizardBuildingBlocks(
    $sdgs: [String!]
    $useCases: [String!]
    $filterBlocks: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedBuildingBlocks(
      sdgs: $sdgs
      useCases: $useCases
      filterBlocks: $filterBlocks
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
      maturity
    }
    paginationAttributeBuildingBlock(
      sdgs: $sdgs
      useCases: $useCases
      filterBlocks: $filterBlocks
    ) {
      totalCount
    }
  }
`

export const WIZARD_USE_CASES_QUERY = gql`
  query WizardUseCases(
    $useCases: [String!]
    $sectors: [String!]
    $buildingBlocks: [String!]
    $sdgs: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedWizardUseCases(
      sdgs: $sdgs
      sectors: $sectors
      useCases: $useCases
      buildingBlocks: $buildingBlocks
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      slug
      name
      imageFile
      maturity
    }
    paginationWizardAttributeUseCase(
      sdgs: $sdgs
      useCases: $useCases
      sectors: $sectors
      buildingBlocks: $buildingBlocks
    ) {
      totalCount
    }
  }
`

export const WIZARD_PRODUCTS_QUERY = gql`
  query WizardProducts(
    $useCases: [String!]
    $buildingBlocks: [String!]
    $sectors: [String!]
    $tags: [String!]
    $sdgs: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedProducts(
      useCases: $useCases
      buildingBlocks: $buildingBlocks
      sectors: $sectors
      tags: $tags
      sdgs: $sdgs
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      tags
      imageFile
    }
    paginationAttributeProduct(
      useCases: $useCases
      buildingBlocks: $buildingBlocks
      sectors: $sectors
      tags: $tags
      sdgs: $sdgs
    ) {
      totalCount
    }
  }
`

export const WIZARD_PROJECTS_QUERY = gql`
  query WizardProjects(
    $countries: [String!]
    $sectors: [String!]
    $tags: [String!]
    $sdgs: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedProjects(
      countries: $countries
      sectors: $sectors
      tags: $tags
      sdgs: $sdgs
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
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
    }
    paginationAttributeProject(
      countries: $countries
      sectors: $sectors
      tags: $tags
      sdgs: $sdgs
    ) {
      totalCount
    }
  }
`

export const WIZARD_DATASETS_QUERY = gql`
  query WizardDatasets(
    $sdgs: [String!]
    $tags: [String!]
    $sectors: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedDatasets(
      sdgs: $sdgs
      tags: $tags
      sectors: $sectors
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      name
      slug
      imageFile
    }
    paginationAttributeDataset(
      sdgs: $sdgs
      tags: $tags
      sectors: $sectors
    ) {
      totalCount
    }
  }
`

export const WIZARD_EXTENDED_DATA_QUERY = gql`
  query WizardExtendedData {
    wizard {
      digitalPrinciples {
        phase
        name
        slug
        url
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
