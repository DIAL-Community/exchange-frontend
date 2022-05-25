import { gql } from '@apollo/client'

export const UPDATE_ORGANIZATION_COUNTRY = gql`
  mutation UpdateOrganizationCountry(
    $slug: String!,
    $countriesSlugs: [String!]!
  ) {
    updateOrganizationCountry(
      slug: $slug,
      countriesSlugs: $countriesSlugs
    ) {
      organization {
        countries {
          id,
          name,
          slug
        }
      },
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_SECTORS = gql`
  mutation UpdateOrganizationSectors(
    $slug: String!,
    $sectorsSlugs: [String!]!
  ) {
    updateOrganizationSectors(
      slug: $slug,
      sectorsSlugs: $sectorsSlugs
    ) {
      organization {
        sectors {
          id,
          name,
          slug
        }
      },
      errors
    }
  }
`
