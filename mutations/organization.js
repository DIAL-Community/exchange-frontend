import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $name: String!,
    $slug: String!,
    $aliases: JSON,
    $imageFile: Upload,
    $website: String,
    $isEndorser: Boolean,
    $whenEndorsed: ISO8601Date,
    $endorserLevel: String,
    $isMni: Boolean,
    $description: String
  ) {
    createOrganization(
      name: $name,
      slug: $slug,
      aliases: $aliases,
      imageFile: $imageFile,
      website: $website,
      isEndorser: $isEndorser,
      whenEndorsed: $whenEndorsed,
      endorserLevel: $endorserLevel,
      isMni: $isMni,
      description: $description
    ) {
      organization {
        name
        slug
        aliases
        website
        isEndorser
        whenEndorsed
        endorserLevel
        isMni
        imageFile
        organizationDescription {
          description
          locale
        }
      }
      errors
    }
  }
`

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

export const UPDATE_ORGANIZATION_PRODUCT = gql`
  mutation UpdateOrganizationProducts(
    $slug: String!,
    $productSlugs: [String!]!
  ) {
    updateOrganizationProducts(
      slug: $slug,
      productSlugs: $productSlugs
    ) {
      organization {
        products {
          id,
          name,
          slug,
          imageFile
        }
      },
      errors
    }
  }
`

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization(
    $id: ID!
  ) {
    deleteOrganization(
      id: $id
    ) {
      organization {
       id
       slug
       name
      }
      errors
    }
  }
`

export const CREATE_CANDIDATE_ORGANIZATION = gql`
  mutation CreateCandidateOrganization(
    $organizationName: String!,
    $website: String!,
    $name: String!,
    $description: String!,
    $email: String!,
    $title: String!,
    $captcha: String!
  ) {
    createCandidateOrganization(
      organizationName: $organizationName,
      website: $website,
      name: $name,
      description: $description,
      email: $email,
      title: $title,
      captcha: $captcha
    ) {
      candidateOrganization {
        id
      }
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_OFFICES = gql`
  mutation UpdateOrganizationOffices(
    $slug: String!
    $offices: [JSON!]!
  ) {
    updateOrganizationOffices(
      slug: $slug
      offices: $offices
    ) {
      organization {
        id
        offices {
          name
          city
          region
          country {
            codeLonger
          }
          latitude
          longitude
        }
      }
      errors
    }
  }
`
