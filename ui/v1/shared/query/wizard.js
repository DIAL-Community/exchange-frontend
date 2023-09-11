import { gql } from '@apollo/client'

export const WIZARD_BUILDING_BLOCKS_QUERY = gql`
  query WizardBuildingBlocks(
    $sdgs: [String!]
    $useCases: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedBuildingBlocks(
      sdgs: $sdgs
      useCases: $useCases
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
    ) {
      totalCount
    }
  }
`

export const WIZARD_USE_CASES_QUERY = gql`
  query WizardUseCases(
    $sdgs: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedUseCases(
      sdgs: $sdgs
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      slug
      name
      imageFile
      maturity
    }
    paginationAttributeUseCase(
      sdgs: $sdgs
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
    paginatedProductsRedux(
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
    paginatedProjectsRedux(
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
  query WizardDatasetsRedux(
    $sdgs: [String!]
    $tags: [String!]
    $sectors: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedDatasetsRedux(
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
