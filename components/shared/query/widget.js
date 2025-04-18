import { gql } from '@apollo/client'

export const PRODUCT_WIDGET_QUERY = gql`
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      tags
      imageFile
      origins {
        id
        name
        slug
      }
      commercialProduct
      mainRepository {
        license
      }
      parsedDescription
    }
  }
`

export const BUILDING_BLOCK_WIDGET_QUERY = gql`
  query BuildingBlock($slug: String!) {
    buildingBlock(slug: $slug) {
      id
      slug
      name
      imageFile
      category
      parsedDescription
    }
  }
`

export const ORGANIZATION_WIDGET_QUERY = gql`
  query Organization($slug: String!) {
    organization(slug: $slug) {
      id
      name
      slug
      imageFile
      parsedDescription
    }
  }
`

export const PROJECT_WIDGET_QUERY = gql`
  query Project($slug: String!) {
    project(slug: $slug) {
      id
      name
      slug
      parsedDescription
      organizations {
        id
        slug
        name
        imageFile
      }
      products {
        id
        slug
        name
        imageFile
      }
    }
  }
`

export const USE_CASE_WIDGET_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      id
      slug
      name
      imageFile
      maturity
      sanitizedDescription
      sector {
        id
        slug
        name
      }
    }
  }
`
