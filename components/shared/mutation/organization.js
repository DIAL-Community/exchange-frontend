import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $name: String!
    $slug: String!
    $aliases: JSON
    $imageFile: Upload
    $website: String
    $isEndorser: Boolean
    $whenEndorsed: ISO8601Date
    $endorserLevel: String
    $isMni: Boolean
    $description: String
    $hasStorefront: Boolean
    $heroFile: Upload
  ) {
    createOrganization(
      name: $name
      slug: $slug
      aliases: $aliases
      imageFile: $imageFile
      website: $website
      isEndorser: $isEndorser
      whenEndorsed: $whenEndorsed
      endorserLevel: $endorserLevel
      isMni: $isMni
      description: $description
      hasStorefront: $hasStorefront
      heroFile: $heroFile
    ) {
      organization {
        id
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
        hasStorefront
        heroFile
        organizationDescription {
          id
          description
          locale
        }
      }
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_COUNTRIES = gql`
  mutation UpdateOrganizationCountries(
    $slug: String!
    $countrySlugs: [String!]!
  ) {
    updateOrganizationCountries(
      slug: $slug
      countrySlugs: $countrySlugs
    ) {
      organization {
        id
        name
        slug
        countries {
          id
          name
          slug
          code
        }
      }
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_SECTORS = gql`
  mutation UpdateOrganizationSectors(
    $slug: String!
    $sectorSlugs: [String!]!
  ) {
    updateOrganizationSectors(
      slug: $slug
      sectorSlugs: $sectorSlugs
    ) {
      organization {
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

export const UPDATE_ORGANIZATION_PROJECTS = gql`
  mutation UpdateOrganizationProjects(
    $slug: String!
    $projectSlugs: [String!]!
  ) {
    updateOrganizationProjects(
      slug: $slug
      projectSlugs: $projectSlugs
    ) {
      organization {
        id
        name
        slug
        projects {
          id
          name
          slug
          origin {
            id
            slug
            name
          }
        }
      }
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_CONTACTS = gql`
  mutation UpdateOrganizationContacts(
    $slug: String!
    $contacts: JSON!
  ) {
    updateOrganizationContacts(
      slug: $slug
      contacts: $contacts
    ) {
      organization {
        id
        name
        slug
        contacts {
          name
          title
          email
        }
      }
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_PRODUCTS = gql`
  mutation UpdateOrganizationProducts(
    $slug: String!
    $productSlugs: [String!]!
  ) {
    updateOrganizationProducts(
      slug: $slug
      productSlugs: $productSlugs
    ) {
      organization {
        id
        name
        slug
        products {
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

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id) {
      organization {
       id
       slug
       name
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
        name
        slug
        offices {
          name
          city
          cityData {
            id
            name
            slug
          }
          region {
            id
            name
            slug
          }
          country {
            id
            name
            slug
            code
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
    $slug: String!
    $specialties: [String!]!
  ) {
    updateOrganizationSpecialties(
      slug: $slug
      specialties: $specialties
    ) {
      organization {
        id
        name
        slug
        specialties
      }
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_RESOURCES = gql`
  mutation UpdateOrganizationResources(
    $slug: String!
    $resourceSlugs: [String!]!
  ) {
    updateOrganizationResources(
      slug: $slug
      resourceSlugs: $resourceSlugs
    ) {
      organization {
        id
        name
        slug
        resources {
          id
          name
          slug
          link
        }
      }
      errors
    }
  }
`

export const UPDATE_ORGANIZATION_PRODUCT_CERTIFICATIONS = gql`
  mutation UpdateOrganizationCertifications(
    $slug: String!
    $productSlugs: [String!]!
  ) {
    updateOrganizationCertifications(
      slug: $slug
      productSlugs: $productSlugs
    ) {
      organization {
        id
        name
        slug
        certifications
        productCertifications {
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

export const UPDATE_ORGANIZATION_BUILDING_BLOCK_CERTIFICATIONS = gql`
  mutation UpdateOrganizationBuildingBlocks(
    $slug: String!
    $buildingBlockSlugs: [String!]!
  ) {
    updateOrganizationBuildingBlocks(
      slug: $slug
      buildingBlockSlugs: $buildingBlockSlugs
    ) {
      organization {
        id
        name
        slug
        buildingBlockCertifications {
          id
          name
          slug
          imageFile
          category
          maturity
        }
      }
      errors
    }
  }
`
