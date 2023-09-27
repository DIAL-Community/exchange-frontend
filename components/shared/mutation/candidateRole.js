import { gql } from '@apollo/client'

export const CANDIDATE_ROLE_ACTION = gql`
  mutation ApproveRejectCandidateRole ($candidateRoleId: ID!, $action: String!) {
    approveRejectCandidateRole (candidateRoleId: $candidateRoleId, action: $action) {
      candidateRole {
        id
        rejected
        rejectedDate
        rejectedBy
        approvedDate
        approvedBy
      }
      errors
    }
  }
`
