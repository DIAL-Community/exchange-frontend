import { gql } from '@apollo/client'

export const CREATE_CANDIDATE_PRODUCT = gql`
  mutation CreateCandidateProduct(
    $slug: String
    $name: String!
    $website: String!
    $repository: String
    $description: String!
    $submitterEmail: String!
    $commercialProduct: Boolean
    $captcha: String!
  ) {
    createCandidateProduct(
      slug: $slug
      name: $name
      website: $website
      repository: $repository
      description: $description
      submitterEmail: $submitterEmail
      commercialProduct: $commercialProduct
      captcha: $captcha
    ) {
      candidateProduct {
        id
        name
        slug
        website
        description
      }
      errors
    }
  }
`

export const CANDIDATE_PRODUCT_ACTION = gql`
  mutation ApproveRejectCandidateProduct (
    $slug: String!
    $action: String!
  ) {
    approveRejectCandidateProduct (
      slug: $slug
      action: $action
    ) {
      candidateProduct {
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
