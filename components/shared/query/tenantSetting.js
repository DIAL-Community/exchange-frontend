import { gql } from '@apollo/client'

export const TENANT_SETTING_DETAIL_QUERY = gql`
  query TenantSetting($tenantName: String) {
    tenantSetting(tenantName: $tenantName) {
      id
      tenantName
      tenantDomains
      allowUnsecureRead
    }
  }
`

export const TENANT_SETTINGS_QUERY = gql`
  query TenantSettings {
    tenantSettings {
      id
      tenantName
      tenantDomains
      allowUnsecureRead
    }
  }
`
