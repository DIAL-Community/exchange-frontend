// Sheet names of the dataset spreadsheet.
export const DEFAULT_SHEET_NAMES = ['Datasets', 'Descriptions', 'Organizations', 'SDGs', 'Sectors']

// Header on each sheet.
const DATASET_HEADERS = [
  'Name', 'Other Names', 'Website', 'Origins', 'Endorsers', 'License', 'Type', 'Tags', 'Data Format', 'Comments',
  'Geographic Coverage', 'Time Range', 'Visualization URL'
]
const DATASET_DESCRIPTION_HEADERS = ['Dataset Name', 'Locale', 'Description']
const ORGANIZATION_HEADERS = ['Dataset Name', 'Organization Name']
const SDG_HEADERS = ['Dataset Name', 'SDG Name']
const SECTOR_HEADERS = ['Dataset Name', 'Sector Name']

// All header configurations.
export const DEFAULT_SHEET_HEADERS = [
  DATASET_HEADERS,
  DATASET_DESCRIPTION_HEADERS,
  ORGANIZATION_HEADERS,
  SDG_HEADERS,
  SECTOR_HEADERS
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

// Column definition for each sheet.
const DATASET_COLUMN_DEFINITION = [
  { data: 'name' },
  { data: 'aliases' },
  { data: 'website' },
  { data: 'origins' },
  { data: 'endorsers' },
  { data: 'license' },
  { data: 'type' },
  { data: 'tags' },
  { data: 'format' },
  { data: 'comments' },
  { data: 'geographicCoverage' },
  { data: 'timeRange' },
  { data: 'visualizationUrl' }
]

const datasetDataDefinition = (spreadsheetProduct) => {
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return createSpreadsheetData(MINIMUM_ROW_COUNT, DATASET_COLUMN_DEFINITION.length)
  }

  return spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    return [
      dataset.name,
      dataset.aliases,
      dataset.website,
      dataset.origins,
      dataset.endorsers,
      dataset.license,
      dataset.type,
      dataset.tags,
      dataset.format,
      dataset.comments,
      dataset.geographicCoverage,
      dataset.timeRange,
      dataset.visualizationUrl
    ]
  })
}

const DATASET_DESCRIPTION_COLUMN_DEFINITION = [
  { data: 'datasetName' },
  { data: 'locale' },
  { data: 'description' }
]

const datasetDescriptionDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, DATASET_DESCRIPTION_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const descriptionData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    return dataset.descriptions.map(description => {
      return [
        dataset.name,
        description.locale,
        description.description
      ]
    })
  }))

  return descriptionData.length > 0 ? descriptionData : defaultData
}

const ORGANIZATION_COLUMN_DEFINITION = [
  { data: 'datasetName' },
  { data: 'organizationName' }
]

const datasetOrganizationDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, ORGANIZATION_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const organizationData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    return dataset.organizations.map(organization => {
      return [
        dataset.name,
        organization.name
      ]
    })
  }))

  return organizationData.length > 0 ? organizationData : defaultData
}

const SECTOR_COLUMN_DEFINITION = [
  { data: 'datasetName' },
  { data: 'sectorName' }
]

const datasetSectorDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, SECTOR_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const sectorData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    return dataset.sectors.map(sector => {
      return [
        dataset.name,
        sector.name
      ]
    })
  }))

  return sectorData.length > 0 ? sectorData : defaultData
}

const SDG_COLUMN_DEFINITION = [
  { data: 'datasetName' },
  { data: 'sdgName' }
]

const datasetSDGDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, SDG_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const sdgData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    return dataset.sdgs.map(sdg => {
      return [
        dataset.name,
        sdg.name
      ]
    })
  }))

  return sdgData.length > 0 ? sdgData : defaultData
}

// All header configurations.
export const DEFAULT_COLUMN_DEFINITIONS = [
  DATASET_COLUMN_DEFINITION,
  DATASET_DESCRIPTION_COLUMN_DEFINITION,
  ORGANIZATION_COLUMN_DEFINITION,
  SDG_COLUMN_DEFINITION,
  SECTOR_COLUMN_DEFINITION
]

const DATA_DEFINITIONS = [
  datasetDataDefinition,
  datasetDescriptionDataDefinition,
  datasetOrganizationDataDefinition,
  datasetSDGDefinition,
  datasetSectorDataDefinition
]

export const mapSpreadsheetData = (spreadsheetProduct, sheetIndex) => {
  return DATA_DEFINITIONS[sheetIndex].call(this, spreadsheetProduct)
}

