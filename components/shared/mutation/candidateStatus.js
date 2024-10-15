import { gql } from '@apollo/client'

export const DELETE_CANDIDATE_STATUS = gql`
  mutation DeleteCandidateStatus($id: ID!) {
    deleteCandidateStatus(id: $id) {
      candidateStatus {
        id
        slug
        name
      }
      errors
    }
  }
`

export const CREATE_CANDIDATE_STATUS = gql`
  mutation CreateCandidateStatus(
    $slug: String!
    $name: String!
    $description: String!
    $initialStatus: Boolean
    $terminalStatus: Boolean
    $notificationTemplate: String!
    $nextCandidateStatusSlugs: [String!]
  ) {
    createCandidateStatus(
      slug: $slug
      name: $name
      description: $description
      initialStatus: $initialStatus
      terminalStatus: $terminalStatus
      notificationTemplate: $notificationTemplate
      nextCandidateStatusSlugs: $nextCandidateStatusSlugs
    ) {
      candidateStatus {
        id
        name
        slug
        description
        initialStatus
        terminalStatus
        notificationTemplate
        nextCandidateStatuses {
          id
          name
          slug
        }
        previousCandidateStatuses {
          id
          name
          slug
        }
      }
      errors
    }
  }
`
