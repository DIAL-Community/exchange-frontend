import { convertToKey, createSpreadsheetData, MINIMUM_ROW_COUNT } from './SpreadsheetCommon'

//TODO:
// * Reorganize the data parser for each tab.

// Default field name connecting between sheets. This field will be used to create the association between
// sheets in the database.
const DEFAULT_SHEET_ASSOC_NAME = 'productName'

// Sheet names of the product spreadsheet.
export const DEFAULT_SHEET_NAMES = [
  'Products',
  'Descriptions',
  'Organizations',
  'SDGs',
  'Sectors',
  'Use Cases Steps',
  'Building Blocks',
  'Pricing'
]

export const COLUMN_SOURCE_KEYS = DEFAULT_SHEET_NAMES.map(sheetName => convertToKey(sheetName))

// Header on each sheet.
const PRODUCT_HEADERS = [
  'Name',
  'Other Names',
  'Website',
  'License',
  'Product Tags',
  'Submitter Name',
  'Submitter Email',
  'Commercial Product?'
]

const PRODUCT_DESCRIPTION_HEADERS = [
  'Product Name',
  'Locale',
  'Description'
]

const ORGANIZATION_HEADERS = [
  'Product Name',
  'Organization Name'
]

const SDG_HEADERS = [
  'Product Name',
  'SDG Number'
]

const BUILDING_BLOCK_HEADERS = [
  'Product Name',
  'Building Block Name'
]

const USE_CASE_STEP_HEADERS = [
  'Product Name',
  'Use Case Step Name'
]

const SECTOR_HEADERS = [
  'Product Name',
  'Sector Name'
]

const COMMERCIAL_PRODUCT_HEADERS = [
  'Product Name',
  'Hosting Model',
  'Pricing Model',
  'Pricing Details',
  'Pricing Date',
  'Pricing URL'
]

// All header configurations.
export const DEFAULT_SHEET_HEADERS = [
  PRODUCT_HEADERS,
  PRODUCT_DESCRIPTION_HEADERS,
  ORGANIZATION_HEADERS,
  SDG_HEADERS,
  SECTOR_HEADERS,
  USE_CASE_STEP_HEADERS,
  BUILDING_BLOCK_HEADERS,
  COMMERCIAL_PRODUCT_HEADERS
]

// Column definition for each sheet.
export const PRODUCT_COLUMN_DEFINITION = [
  { data: 'name' },
  { data: 'aliases' },
  { data: 'website' },
  { data: 'license' },
  { data: 'tags' },
  { data: 'submitterName' },
  { data: 'submitterEmail' },
  { data: 'commercialProduct' }
]

const productDataDefinition = (spreadsheetProduct) => {
  // If the sheet doesn't have data, return the minimum row above.
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return createSpreadsheetData(MINIMUM_ROW_COUNT, PRODUCT_COLUMN_DEFINITION.length)
  }

  // Spreadsheet have data, map the data from graph query result to the spreadsheet.
  // Define which field in the data will go to which column.
  return spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    return PRODUCT_COLUMN_DEFINITION.map(column => product[column.data])
  })
}

const PRODUCT_DESCRIPTION_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
  { data: 'locale' },
  { data: 'description' }
]

const productDescriptionDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, PRODUCT_DESCRIPTION_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const descriptionData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    if (!product.descriptions) {
      return []
    }

    return product.descriptions
      .map(description => [product.name].concat(
        PRODUCT_DESCRIPTION_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => description[column.data])
      ))
      .sort(([, localeX], [, localeY]) => String(localeX).localeCompare(String(localeY)))
  }))

  return descriptionData.length > 0 ? descriptionData : defaultData
}

const ORGANIZATION_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
  { data: 'name' }
]

const productOrganizationDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, ORGANIZATION_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const organizationData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    if (!product.organizations) {
      return []
    }

    return product.organizations
      .map(organization => [product.name].concat(
        ORGANIZATION_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => organization[column.data])
      ))
      .sort(([, nameX], [, nameY]) => String(nameX).localeCompare(String(nameY)))
  }))

  return organizationData.length > 0 ? organizationData : defaultData
}

const BUILDING_BLOCK_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
  { data: 'name' }
]

const productBuildingBlockDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, BUILDING_BLOCK_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const buildingBlockData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    if (!product.buildingBlocks) {
      return []
    }

    return product.buildingBlocks
      .map(buildingBlock => [product.name].concat(
        BUILDING_BLOCK_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => buildingBlock[column.data])
      ))
      .sort(([, nameX], [, nameY]) => String(nameX).localeCompare(String(nameY)))
  }))

  return buildingBlockData.length > 0 ? buildingBlockData : defaultData
}

const USE_CASE_STEP_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
  { data: 'name' }
]

const productUseCaseStepDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, USE_CASE_STEP_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const useCaseStepData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    if (!product.useCasesSteps) {
      return []
    }

    return product.useCasesSteps
      .map(useCaseStep => [product.name].concat(
        USE_CASE_STEP_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => useCaseStep[column.data])
      ))
      .sort(([, nameX], [, nameY]) => String(nameX).localeCompare(String(nameY)))
  }))

  return useCaseStepData.length > 0 ? useCaseStepData : defaultData
}

const SECTOR_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
  { data: 'name' }
]

const productSectorDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, SECTOR_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const sectorData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    if (!product.sectors) {
      return []
    }

    return product.sectors
      .map(sector => [product.name].concat(
        SECTOR_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => sector[column.data])
      ))
      .sort(([, nameX], [, nameY]) => String(nameX).localeCompare(String(nameY)))
  }))

  return sectorData.length > 0 ? sectorData : defaultData
}

const SDG_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
  { data: 'number' }
]

const productSDGDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, SDG_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const sdgData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    if (!product.sdgs) {
      return []
    }

    return product.sdgs
      .map(sdg => [product.name].concat(
        SDG_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => sdg[column.data])
      ))
      .sort(([, numberX], [, numberY]) => numberX < numberY)
  }))

  return sdgData.length > 0 ? sdgData : defaultData
}

const PRICING_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
  { data: 'hostingModel' },
  { data: 'pricingModel' },
  { data: 'pricingDetails' },
  { data: 'pricingDate' },
  { data: 'pricingUrl' }
]

const productCommercialDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, PRICING_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const pricingData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    return havePricingInformation(product)
      ? [[].concat.apply([product.name], [
        PRICING_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => product[column.data])
      ])]
      : []
  }))

  return pricingData.length > 0 ? pricingData : defaultData
}

const havePricingInformation = (product) => {
  return product && (
    product.hostingModel || product.pricingModel || product.pricingDetails || product.pricingDatetime ||
    product.pricingUrl
  )
}

const DATA_DEFINITIONS = [
  productDataDefinition,
  productDescriptionDataDefinition,
  productOrganizationDataDefinition,
  productSDGDefinition,
  productSectorDataDefinition,
  productUseCaseStepDataDefinition,
  productBuildingBlockDataDefinition,
  productCommercialDefinition
]

// Define how to map spreadsheet data from graph query to the table.
export const mapSpreadsheetData = (spreadsheetProduct, sheetIndex) => {
  return DATA_DEFINITIONS[sheetIndex].call(this, spreadsheetProduct)
}
