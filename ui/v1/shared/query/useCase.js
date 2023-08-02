import { gql } from '@apollo/client'

export const USE_CASE_SEARCH_QUERY = gql`
  query UseCases($search: String!, $mature: Boolean!) {
    useCases(search: $search, mature: $mature) {
      id
      name
      slug
    }
  }
`

export const USE_CASE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeUseCase(
    $search: String!
    $sdgs: [String!]
    $showBeta: Boolean
    $govStackOnly: Boolean
  ) {
    paginationAttributeUseCase(
      search: $search
      sdgs: $sdgs
      showBeta: $showBeta
      govStackOnly: $govStackOnly
    ) {
      totalCount
    }
  }
`

export const PAGINATED_USE_CASES_QUERY = gql`
  query PaginatedUseCases(
    $search: String!
    $sdgs: [String!]
    $showBeta: Boolean
    $govStackOnly: Boolean
    $limit: Int!
    $offset: Int!
  ) {
    paginatedUseCases(
      search: $search
      sdgs: $sdgs
      showBeta: $showBeta
      govStackOnly: $govStackOnly
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      slug
      name
      imageFile
      maturity
      markdownUrl
      sector {
        id
        slug
        name
      }
      sanitizedDescription
      buildingBlocks {
        id
        slug
        name
      }
      sdgTargets {
        id
        name
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
        id
        slug
        name
      }
      maturity
      imageFile
      markdownUrl
      useCaseDescription {
        description
      }
      useCaseSteps {
        id
        name
        slug
        workflows {
          id
        }
        products {
          id
        }
        buildingBlocks {
          id
        }
      }
      sdgTargets {
        id
        name
        targetNumber
        sdg {
          id
          name
          slug
          number
          imageFile
        }
      }
      workflows {
        id
        name
        slug
        imageFile
      }
      buildingBlocks {
        id
        name
        slug
        maturity
        category
        imageFile
      }
      tags
    }
  }
`