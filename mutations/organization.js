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