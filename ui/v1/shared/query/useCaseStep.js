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
  }
`
