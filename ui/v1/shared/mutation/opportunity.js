import { gql } from '@apollo/client'

export const DELETE_OPPORTUNITY = gql`
  mutation DeleteOpportunity($id: ID!) {
    deleteOpportunity(id: $id) {
      opportunity {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_OPPORTUNITY = gql`
  mutation CreateOpportunity(
    $name: String!
    $slug: String!
  ) {
    createOpportunity(
      name: $name
      slug: $slug
    ) {
      opportunity {
        id
        name
        slug
      }
      errors
    }
  }
`

export const UPDATE_OPPORTUNITY_COUNTRIES = gql`
  mutation UpdateOpportunityCountries(
    $slug: String!
    $countrySlugs: [String!]!
  ) {
    updateOpportunityCountries(
      slug: $slug
      countrySlugs: $countrySlugs
    ) {
      opportunity {
        id
        name
        slug
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

export const UPDATE_OPPORTUNITY_SECTORS = gql`
  mutation UpdateOpportunitySectors(
    $slug: String!
    $sectorSlugs: [String!]!
  ) {
    updateOpportunitySectors(
      slug: $slug
      sectorSlugs: $sectorSlugs
    ) {
      opportunity {
        id
        name
        slug
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

export const UPDATE_OPPORTUNITY_ORGANIZATIONS = gql`
  mutation UpdateOpportunityOrganizations(
    $slug: String!
    $organizationSlugs: [String!]!
  ) {
    updateOpportunityOrganizations(
      slug: $slug
      organizationSlugs: $organizationSlugs
    ) {
      opportunity {
        id
        name
        slug
        organizations {
          id
          name
          slug
          imageFile
        }
      }
      errors
    }
  }
`

export const UPDATE_OPPORTUNITY_USE_CASES = gql`
  mutation UpdateOpportunityUseCases(
    $slug: String!
    $useCaseSlugs: [String!]!
  ) {
    updateOpportunityUseCases(
      slug: $slug
      useCaseSlugs: $useCaseSlugs
    ) {
      opportunity {
        id
        name
        slug
        useCases {
          id
          name
          slug
          imageFile
          maturity
        }
      }
      errors
    }
  }
`

export const UPDATE_OPPORTUNITY_BUILDING_BLOCKS = gql`
  mutation UpdateOpportunityBuildingBlocks(
    $slug: String!
    $buildingBlockSlugs: [String!]!
  ) {
    updateOpportunityBuildingBlocks(
      slug: $slug
      buildingBlockSlugs: $buildingBlockSlugs
    ) {
      opportunity {
        id
        name
        slug
        buildingBlocks {
          id
          name
          slug
          imageFile
        }
      }
      errors
    }
  }
`

export const UPDATE_OPPORTUNITY_TAGS = gql`
  mutation UpdateOpportunityTags(
    $slug: String!
    $tags: [String!]!
  ) {
    updateOpportunityTags(
      slug: $slug
      tags: $tags
    ) {
      opportunity {
        id
        name
        slug
        tags
      }
      errors
    }
  }
`
