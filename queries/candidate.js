import { gql } from '@apollo/client'

export const CANDIDATE_ROLE_QUERY = gql`
  query CandidateRole(
    $email: String!
    $productId: String!
    $organizationId: String!
  ) {
    candidateRole(
      email: $email
      productId: $productId
      organizationId: $organizationId
    ) {
      id
      productId
      organizationId
      rejected
    }
  }
`
