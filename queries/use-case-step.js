import { gql } from '@apollo/client'

export const USE_CASE_STEPS_QUERY = gql`
  query UseCaseSteps($slug: String!) {
    useCaseSteps(slug: $slug) {
        slug
        products {
            slug
        }
    }
  }
`
