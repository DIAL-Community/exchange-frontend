import { gql } from '@apollo/client'

export const CREATE_WIZARD_GUIDANCE_MAIL = gql`
  mutation CreateWizardGuidanceMail (
    $name: String!
    $emailAddress: String!
    $message: String!
  ) {
    createWizardGuidanceMail(
      name: $name
      emailAddress: $emailAddress
      message: $message
    ) {
      response
    }
  }
`
