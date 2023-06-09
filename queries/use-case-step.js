import { gql } from '@apollo/client'

export const USE_CASE_STEPS_QUERY = gql`
  query UseCaseSteps($slug: String!) {
    useCaseSteps(slug: $slug) {
      id
      name
      slug
      stepNumber
      useCase {
        slug
        name
      }
      workflows {
        slug
        name
        imageFile
      }
      products {
        name
        slug
        imageFile
      }
      buildingBlocks {
        name
        slug
        imageFile
      }
    }
  }
`

export const USE_CASE_STEP_QUERY = gql`
  query UseCaseStep($slug: String!, $useCaseSlug: String!) {
    useCaseStep(slug: $slug) {
      id
      name
      slug
      stepNumber
      useCaseStepDescription {
        description
        locale
      }
      workflows {
        name
        slug
        imageFile
      }
      products {
        name
        slug
        imageFile
      }
      datasets {
        name
        slug
        imageFile
      }
      buildingBlocks {
        slug
        name
        imageFile
        maturity
        category
      }
    }
    useCase(slug: $useCaseSlug) {
      id
      name
      slug
      markdownUrl
      buildingBlocks {
        slug
        name
        imageFile
        maturity
        category
      }
    }
  }
`

export const USE_CASE_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      id
      name
      slug
      maturity
      imageFile
      useCaseSteps{
        name
      }
    }
  }
`
