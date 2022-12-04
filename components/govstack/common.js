export const BUILDING_BLOCK_YAML_KEYS = [
  { label: 'bb-information-mediator', value: 'api/govstack_im_service_metadata_api-0.3-swagger.json' },
  { label: 'bb-consent', value: 'api/consent-openapi.yaml' },
  { label: 'bb-digital-registries', value: 'api/GovStack_Digital_registries_BB_Data_API_template-1.3.0.json' },
  { label: 'bb-identity', value: 'api/swagger.yaml' },
  { label: 'bb-messaging', value: 'api/swagger.yaml' },
  { label: 'bb-payments', value: 'api/swagger.yaml' },
  { label: 'bb-registration', value: 'api/swagger.yaml' },
  { label: 'bb-scheduler', value: 'api/swagger.yaml' },
  { label: 'bb-workflow', value: 'api/swagger.yaml' },
  { label: 'bb-ux', value: 'api/swagger.yaml' },
  { label: 'bb-esignature', value: 'api/swagger.yaml' },
  { label: 'bb-emarketplace', value: 'api/swagger.yaml' },
  { label: 'bb-cloud-infrastructure-hosting', value: 'api/swagger.yaml' }
]

export const DEFAULT_REPO_OWNER = process.env.NEXT_PUBLIC_API_REPO_OWNER
export const DEFAULT_BRANCH_NAME = 'main'

export const prependPadding = (number, size) => {
  number = number.toString()
  while (number.length < size) {
    number = `0${number}`
  }

  return number
}
