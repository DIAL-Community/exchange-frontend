import { gql } from '@apollo/client'

export const DELETE_OPPORTUNITY = gql`
  mutation DeleteOpportunity($id: ID!) {
    deleteOpportunity(id: $id) {
      country {
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
      country {
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
    $slug: String!,
    $tags: [String!]!
  ) {
    updateOpportunityTags(
      slug: $slug
      tags: $tags
    ) {
      project {
        id
        slug
        tags
      }
      errors
    }
  }
`
