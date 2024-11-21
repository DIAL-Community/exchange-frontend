import { gql } from '@apollo/client'

export const SYNC_TENANTS = gql`
  mutation SyncTenants(
    $sourceTenant: String!
    $destinationTenant: String!
    $buildingBlockSlugs: [String!]!
    $datasetSlugs: [String!]!
    $productSlugs: [String!]!
    $projectSlugs: [String!]!
    $useCaseSlugs: [String!]!
  ) {
    syncTenants(
      sourceTenant: $sourceTenant
      destinationTenant: $destinationTenant
      buildingBlockSlugs: $buildingBlockSlugs
      datasetSlugs: $datasetSlugs
      productSlugs: $productSlugs
      projectSlugs: $projectSlugs
      useCaseSlugs: $useCaseSlugs
    ) {
      syncCompleted
      errors
    }
  }
`
