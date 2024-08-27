import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_RESOURCE = gql`
  mutation CreateCandidateResource(
    $name: String!
    $slug: String!
    $countrySlugs: [String!]!
    $description: String!
    $resourceType: String!
    $resourceLink: String!
    $linkDescription: String!
    $submitterEmail: String!
    $captcha: String!
  ) {
    createCandidateResource (
      name: $name
      slug: $slug
      countrySlugs: $countrySlugs
      description: $description
      resourceType: $resourceType
      resourceLink: $resourceLink
      linkDescription: $linkDescription
      submitterEmail: $submitterEmail
      captcha: $captcha
    ) {
      candidateResource {
        id
        name
        slug
        description
        resourceType
        resourceLink
        linkDescription
        submitterEmail
        createdAt
        rejected
      }
      errors
    }
  }  
`

export const CANDIDATE_RESOURCE_ACTION = gql`
  mutation ApproveRejectCandidateResource (
    $slug: String!
    $action: String!
  ) {
    approveRejectCandidateResource (
      slug: $slug
      action: $action
    ) {
      candidateResource {
        id
        name
        slug
  
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
