import { gql } from '@apollo/client'

export const OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeOpportunity($search: String) {
    paginationAttributeOpportunity(search: $search) {
      totalCount
    }
  }
`

export const PAGINATED_OPPORTUNITIES_QUERY = gql`
  query PaginatedOpportunities(
    $search: String
    $sectors: [String!]
    $tags: [String!]
    $limit: Int!
    $offset: Int!
  ) {
    paginatedOpportunities(
      search: $search
      sectors: $sectors
      tags: $tags
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      slug
      name
      imageFile
      description
      tags
    }
  }
`

export const OPPORTUNITY_DETAIL_QUERY = gql`
  query Opportunity($slug: String!) {
    opportunity(slug: $slug) {
      id
      slug
      name
      tags
      imageFile
      webAddress
      description
      opportunityStatus
      opportunityType
      closingDate
      openingDate
      contactName
      contactEmail
      origin {
        id
        name
        slug
      }
      buildingBlocks {
        id
        slug
        name
        imageFile
      }
      organizations {
        id
        slug
        name
        imageFile
      }
      useCases {
        id
        slug
        name
        maturity
        imageFile
      }
      sectors {
        id
        slug
        name
      }
      countries {
        id
        slug
        name
      }
    }
  }
`
