import { gql } from '@apollo/client'

export const USE_CASE_PAGINATION_ATTRIBUTES_QUERY = gql`
  query UseCasePaginationAttributesQuery(
    $search: String!
    $sdgs: [String!]
    $showBeta: Boolean
    $govStackOnly: Boolean
  ) {
    useCasePaginationAttributes(
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
  query PaginatedUseCasesQuery(
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
