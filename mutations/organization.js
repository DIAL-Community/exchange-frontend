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
        specialties
        organizationDescription {
          description
          locale
        }
      }
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_COUNTRIES = gql`
  mutation UpdateOrganizationCountry(
    $slug: String!,
    $countrySlugs: [String!]!
  ) {
    updateOrganizationCountry(
      slug: $slug,
      countrySlugs: $countrySlugs
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
    $sectorSlugs: [String!]!
  ) {
    updateOrganizationSectors(
      slug: $slug,
      sectorSlugs: $sectorSlugs
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
    $projectSlugs: [String!]!
  ) {
    updateOrganizationProjects(
      slug: $slug,
      projectSlugs: $projectSlugs
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

export const UPDATE_ORGANIZATION_PRODUCTS = gql`
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

export const UPDATE_ORGANIZATION_SPECIALTIES = gql`
  mutation UpdateOrganizationSpecialties(
    $slug: String!,
    $specialties: [String!]!
  ) {
    updateOrganizationSpecialties(
      slug: $slug,
      specialties: $specialties
    ) {
      organization {
        id,
        specialties
      },
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_RESOURCES = gql`
  mutation UpdateOrganizationResources(
    $slug: String!,
    $resourceSlugs: [String!]!
  ) {
    updateOrganizationResources(
      slug: $slug,
      resourceSlugs: $resourceSlugs
    ) {
      organization {
        id,
        resources {
          id
          name
          slug
          link
        }
      },
      errors
    }
  }
`
