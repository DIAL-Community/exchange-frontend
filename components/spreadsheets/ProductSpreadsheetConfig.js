// Sheet names of the product spreadsheet.
export const DEFAULT_SHEET_NAMES = ['Products', 'Descriptions', 'Organizations', 'SDGs', 'Sectors']

// Header on each sheet.
const PRODUCT_HEADERS = ['Name', 'Other Names', 'Website', 'License', 'Product Type', 'Product Tags', 'Submitter Name', 'Submitter Email']
const PRODUCT_DESCRIPTION_HEADERS = ['Product Name', 'Locale', 'Description']
const ORGANIZATION_HEADERS = ['Product Name', 'Organization Name']
const SDG_HEADERS = ['Product Name', 'SDG Name']
const SECTOR_HEADERS = ['Product Name', 'Sector Name']

// All header configurations.
export const DEFAULT_SHEET_HEADERS = [
  PRODUCT_HEADERS,
  PRODUCT_DESCRIPTION_HEADERS,
  ORGANIZATION_HEADERS,
  SDG_HEADERS,
  SECTOR_HEADERS
]

// Column definition for each sheet.
const PRODUCT_COLUMN_DEFINITION = [
  { data: 'name' },
  { data: 'aliases' },
  { data: 'website' },
  { data: 'license' },
  { data: 'type' },
  { data: 'tags' },
  { data: 'submitterName' },
  { data: 'submitterEmail' }
]

const PRODUCT_DESCRIPTION_COLUMN_DEFINITION = [
  { data: 'productName' },
  { data: 'locale' },
  { data: 'description' }
]

const ORGANIZATION_COLUMN_DEFINITION = [
  { data: 'productName' },
  { data: 'organizationName' }
]

const SDG_COLUMN_DEFINITION = [
  { data: 'productName' },
  { data: 'sdgName' }
]

const SECTOR_COLUMN_DEFINITION = [
  { data: 'productName' },
  { data: 'sectorName' }
]

// All header configurations.
export const DEFAULT_COLUMN_DEFINITIONS = [
  PRODUCT_COLUMN_DEFINITION,
  PRODUCT_DESCRIPTION_COLUMN_DEFINITION,
  ORGANIZATION_COLUMN_DEFINITION,
  SDG_COLUMN_DEFINITION,
  SECTOR_COLUMN_DEFINITION
]

const MINIMUM_ROW_COUNT = 1
const createSpreadsheetData = (rowCount, columnCount) => {
  const rows = []
  for (let i = 0; i < rowCount; i++) {
    const row = []

    for (let j = 0; j < columnCount; j++) {
      row.push(null)
    }

    rows.push(row)
  }

  return rows
}

const productDataDefinition = (spreadsheetProduct) => {
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return createSpreadsheetData(MINIMUM_ROW_COUNT, PRODUCT_COLUMN_DEFINITION.length)
  }

  return spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    return [
      product.name,
      product.aliases,
      product.website,
      product.license,
      product.type,
      product.tags,
      product.submitterName,
      product.submitterEmail
    ]
  })
}

const productDescriptionDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, PRODUCT_DESCRIPTION_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const descriptionData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    return product.descriptions.map(description => {
      return [
        product.name,
        description.locale,
        description.description
      ]
    })
  }))

  return descriptionData.length > 0 ? descriptionData : defaultData
}

const productOrganizationDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, ORGANIZATION_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const organizationData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    return product.organizations.map(organization => {
      return [
        product.name,
        organization.name
      ]
    })
  }))

  return organizationData.length > 0 ? organizationData : defaultData
}

const productSectorDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, SECTOR_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const sectorData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    return product.sectors.map(sector => {
      return [
        product.name,
        sector.name
      ]
    })
  }))

  return sectorData.length > 0 ? sectorData : defaultData
}

const productSDGDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, SDG_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const sdgData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const product = entry.spreadsheetData

    return product.sdgs.map(sdg => {
      return [
        product.name,
        sdg.name
      ]
    })
  }))

  return sdgData.length > 0 ? sdgData : defaultData
}

const DATA_DEFINITIONS = [
  productDataDefinition,
  productDescriptionDataDefinition,
  productOrganizationDataDefinition,
  productSDGDefinition,
  productSectorDataDefinition
]

export const mapSpreadsheetData = (spreadsheetProduct, sheetIndex) => {
  return DATA_DEFINITIONS[sheetIndex].call(this, spreadsheetProduct)
}

