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

export const UPDATE_ORGANIZATION_PROJECTS = gql`
  mutation UpdateOrganizationProjects(
    $slug: String!,
    $projectsSlugs: [String!]!
  ) {
    updateOrganizationProjects(
      slug: $slug,
      projectsSlugs: $projectsSlugs
    ) {
      organization {
        projects {
          id,
          name,
          slug,
          origin {
            slug
          }
        }
      },
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_CONTACTS = gql`
  mutation UpdateOrganizationContacts(
    $slug: String!,
    $contacts: JSON!
  ) {
    updateOrganizationContacts(
      slug: $slug,
      contacts: $contacts
    ) {
      organization {
        contacts {
          name,
          title,
          email,
        }
      },
      errors
    }
  }
`
