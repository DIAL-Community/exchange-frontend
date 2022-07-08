import { gql } from '@apollo/client'

export const USE_CASE_QUERY = gql`
  query UseCase($slug: String!) {
    useCase(slug: $slug) {
      id
      name
      slug
      sector {
        slug
        name
        id
      }
      maturity
      useCaseDescription {
        description
      }
    }
  }
`
