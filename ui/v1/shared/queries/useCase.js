import { gql } from '@apollo/client'

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
      paginationAttributes {
        totalCount
      }
      useCases {
        id
        slug
        name
        maturity
        markdownUrl
        sector {
          id
          slug
          name
        }
        useCaseDescription {
          description
        }
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
  }
`
