import { gql } from '@apollo/client'

export const DELETE_TENANT_SETTING = gql`
  mutation DeleteTenantSetting($tenantName: String!) {
    deleteTenantSetting(tenantName: $tenantName) {
      tenantSetting {
        id
        tenantName
        tenantDomains
      }
      errors
    }
  }
`

export const CREATE_TENANT_SETTING = gql`
  mutation CreateTenantSetting(
    $tenantName: String!
    $tenantDomains: [String!]!
    $allowUnsecuredRead: Boolean!
  ) {
    createTenantSetting(
      tenantName: $tenantName
      tenantDomains: $tenantDomains
      allowUnsecuredRead: $allowUnsecuredRead
    ) {
      tenantSetting {
        id
        tenantName
        tenantDomains
      }
      errors
    }
  }
`
