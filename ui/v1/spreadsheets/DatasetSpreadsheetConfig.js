import { convertToKey, createSpreadsheetData, MINIMUM_ROW_COUNT } from './SpreadsheetCommon'

const DEFAULT_SHEET_ASSOC_NAME = 'datasetName'

// Sheet names of the dataset spreadsheet.
export const DEFAULT_SHEET_NAMES = ['Datasets', 'Descriptions', 'Organizations', 'SDGs', 'Sectors']
export const COLUMN_SOURCE_KEYS = DEFAULT_SHEET_NAMES.map(sheetName => convertToKey(sheetName))

// Header on each sheet.
const DATASET_HEADERS = [
  'Name',
  'Other Names',
  'Website',
  'Origins',
  'Endorsers',
  'License',
  'Type',
  'Tags',
  'Data Format',
  'Comments',
  'Geographic Coverage',
  'Time Range',
  'Visualization URL',
  'Languages'
]
const DATASET_DESCRIPTION_HEADERS = ['Dataset Name', 'Locale', 'Description']
const ORGANIZATION_HEADERS = ['Dataset Name', 'Organization Name']
const SDG_HEADERS = ['Dataset Name', 'SDG Number']
const SECTOR_HEADERS = ['Dataset Name', 'Sector Name']

// All header configurations.
export const DEFAULT_SHEET_HEADERS = [
  DATASET_HEADERS,
  DATASET_DESCRIPTION_HEADERS,
  ORGANIZATION_HEADERS,
  SDG_HEADERS,
  SECTOR_HEADERS
]

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
  { data: 'visualizationUrl' },
  { data: 'languages' }
]

const datasetDataDefinition = (spreadsheetProduct) => {
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return createSpreadsheetData(MINIMUM_ROW_COUNT, DATASET_COLUMN_DEFINITION.length)
  }

  return spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    return DATASET_COLUMN_DEFINITION.map(column => dataset[column.data])
  })
}

const DATASET_DESCRIPTION_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
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

    if (!dataset.descriptions) {
      return []
    }

    return dataset.descriptions
      .map(description => [dataset.name].concat(
        DATASET_DESCRIPTION_COLUMN_DEFINITION
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

const datasetOrganizationDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, ORGANIZATION_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const organizationData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    if (!dataset.organizations) {
      return []
    }

    return dataset.organizations
      .map(organization => [dataset.name].concat(
        ORGANIZATION_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => organization[column.data])
      ))
      .sort(([, nameX], [, nameY]) => String(nameX).localeCompare(String(nameY)))
  }))

  return organizationData.length > 0 ? organizationData : defaultData
}

const SECTOR_COLUMN_DEFINITION = [
  { data: DEFAULT_SHEET_ASSOC_NAME },
  { data: 'name' }
]

const datasetSectorDataDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, SECTOR_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const sectorData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    if (!dataset.sectors) {
      return []
    }

    return dataset.sectors
      .map(sector => [dataset.name].concat(
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

const datasetSDGDefinition = (spreadsheetProduct) => {
  const defaultData = createSpreadsheetData(MINIMUM_ROW_COUNT, SDG_COLUMN_DEFINITION.length)
  if (!spreadsheetProduct || spreadsheetProduct.length === 0) {
    return defaultData
  }

  const sdgData = [].concat.apply([], spreadsheetProduct.map(entry => {
    const dataset = entry.spreadsheetData

    if (!dataset.sdgs) {
      return []
    }

    return dataset.sdgs
      .map(sdg => [dataset.name].concat(
        SDG_COLUMN_DEFINITION
          .filter(column => column.data !== DEFAULT_SHEET_ASSOC_NAME)
          .map(column => sdg[column.data])
      ))
      .sort(([, numberX], [, numberY]) => numberX < numberY)
  }))

  return sdgData.length > 0 ? sdgData : defaultData
}

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
