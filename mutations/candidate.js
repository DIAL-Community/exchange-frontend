import { gql } from '@apollo/client'

export const APPROVE_CANDIDATE_ROLE = gql`
  mutation ApproveCandidateRole ($candidateRoleId: ID!, $action: String!) {
    approveRejectCandidateRole (candidateRoleId: $candidateRoleId, action: $action) {
      candidateRole {
        id
        rejected
      }
      errors
    }
  }
`

export const REJECT_CANDIDATE_ROLE = gql`
  mutation RejectCandidateRole ($candidateRoleId: ID!, $action: String!) {
    approveRejectCandidateRole (candidateRoleId: $candidateRoleId, action: $action) {
      candidateRole {
        id
        rejected
      }
      errors
    }
  }
`
