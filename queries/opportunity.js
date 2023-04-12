import { gql } from '@apollo/client'

export const OPPORTUNITY_SEARCH_QUERY = gql`
  query Opportunities($search: String!) {
    opportunities(search: $search) {
      id
      name
      slug
      imageFile
      webAddress
    }
  }
`

export const OPPORTUNITIES_QUERY = gql`
  query SearchOpportunities(
    $first: Int
    $after: String
    $sectors: [String!]
    $countries: [String!]
    $useCases: [String!]
    $buildingBlocks: [String!]
    $organizations: [String!]
    $showClosed: Boolean,
    $search: String!
  ) {
    searchOpportunities(
      first: $first
      after: $after
      sectors: $sectors
      countries: $countries
      useCases: $useCases
      buildingBlocks: $buildingBlocks
      organizations: $organizations
      showClosed: $showClosed
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
        webAddress
        description
        opportunityStatus
        opportunityType
        sectors {
          id
          slug
          name
        }
      }
    }
  }
`

export const OPPORTUNITY_QUERY = gql`
  query Opportunity($slug: String!) {
    opportunity(slug: $slug) {
      id
      name
      slug
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
        name
        slug
      }
      buildingBlocks {
        slug
        name
        imageFile
      }
      organizations {
        slug
        name
        imageFile
      }
      useCases {
        slug
        name
        maturity
        imageFile
      }
      sectors {
        slug
        name
      }
      countries {
        slug
        name
      }
    }
  }
`
