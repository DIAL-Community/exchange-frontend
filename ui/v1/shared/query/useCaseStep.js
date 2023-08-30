import { gql } from '@apollo/client'

export const USE_CASE_STEP_QUERY = gql`
  query UseCaseStep(
    $slug: String!
    $stepSlug: String!
  ) {
    useCase(slug: $slug) {
      id
      name
      slug
      imageFile
      markdownUrl
      useCaseSteps {
        id
        name
        slug
      }
    }
    useCaseStep(slug: $stepSlug) {
      id
      name
      slug
      stepNumber
      useCaseStepDescription {
        id
        description
        locale
      }
      workflows {
        id
        name
        slug
        imageFile
      }
      products {
        id
        name
        slug
        imageFile
      }
      datasets {
        id
        name
        slug
        imageFile
      }
      buildingBlocks {
        id
        slug
        name
        imageFile
        maturity
        category
      }
    }
  }
`
