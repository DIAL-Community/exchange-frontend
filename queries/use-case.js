import { gql } from '@apollo/client'

export const USE_CASE_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      id
      name
      slug
      maturity
      markdownUrl
      sector {
        slug
        name
        id
      }
      useCaseDescription {
        description
      }
    }
  }
`

export const USE_CASE_DETAIL_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      id
      name
      slug
      sector {
        slug
        name
        id
      }
      maturity
      imageFile
      markdownUrl
      useCaseDescription {
        description
      }
      useCaseDescription {
        description
        locale
      }
      sdgTargets {
        id
        name
        targetNumber
        sdgNumber
      }
      workflows {
        name
        slug
        imageFile
      }
      buildingBlocks {
        name
        slug
        maturity
        category
        imageFile
      }
      useCaseHeaders {
        header
      }
      tags
    }
  }
`

export const USE_CASE_SEARCH_QUERY = gql`
  query UseCases($search: String!, $mature: Boolean!) {
    useCases(search: $search, mature: $mature) {
      id
      name
      slug
    }
  }
`

export const USE_CASES_QUERY = gql`
  query SearchUseCases(
    $first: Int,
    $after: String,
    $sdgs: [String!],
    $showBeta: Boolean,
    $search: String!
  ) {
    searchUseCases(
      first: $first,
      after: $after,
      sdgs: $sdgs,
      showBeta: $showBeta,
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
        maturity
        markdownUrl
        sdgTargets {
          id
          name
          targetNumber
        }
        useCaseSteps {
          id
          name
          workflows {
            id
            name
            slug
            imageFile
          }
        }
      }
    }
  }
`
