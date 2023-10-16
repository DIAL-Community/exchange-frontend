import { gql } from '@apollo/client'

export const OPPORTUNITY_PAGINATION_ATTRIBUTES_QUERY = gql`
  query PaginationAttributeOpportunity(
    $countries: [String!]
    $buildingBlocks: [String!]
    $organizations: [String!]
    $useCases: [String!]
    $sectors: [String!]
    $tags: [String!]
    $showClosed: Boolean,
    $search: String!
  ) {
    paginationAttributeOpportunity(
      countries: $countries
      buildingBlocks: $buildingBlocks
      organizations: $organizations
      useCases: $useCases
      sectors: $sectors
      tags: $tags
      showClosed: $showClosed
      search: $search
    ) {
      totalCount
    }
  }
`

export const PAGINATED_OPPORTUNITIES_QUERY = gql`
  query PaginatedOpportunities(
    $countries: [String!]
    $buildingBlocks: [String!]
    $organizations: [String!]
    $useCases: [String!]
    $sectors: [String!]
    $tags: [String!]
    $showClosed: Boolean,
    $search: String!
    $limit: Int!
    $offset: Int!
  ) {
    paginatedOpportunities(
      countries: $countries
      buildingBlocks: $buildingBlocks
      organizations: $organizations
      useCases: $useCases
      sectors: $sectors
      tags: $tags
      showClosed: $showClosed
      search: $search
      offsetAttributes: { limit: $limit, offset: $offset }
    ) {
      id
      slug
      name
      imageFile
      description
      opportunityStatus
      closingDate
      tags
      sectors {
        id
      }
      organizations {
        id
      }
      countries {
        id
      }
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
        maturity
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
        code
      }
    }
  }
`
