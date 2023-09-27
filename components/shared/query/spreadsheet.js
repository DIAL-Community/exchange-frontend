import { gql } from '@apollo/client'

export const PRODUCT_SPREADSHEET_QUERY = gql`
  query SpreadsheetProduct {
    spreadsheetProduct {
      id
      spreadsheetType
      spreadsheetData
    }
    organizations {
      id
      name
      slug
    }
    sdgs {
      id
      name
      slug
      number
    }
    sectors {
      id
      name
      slug
    }
    buildingBlocks {
      id
      name
      slug
    }
    useCasesSteps {
      id
      name
      slug
    }
  }
`

export const DATASET_SPREADSHEET_QUERY = gql`
  query SpreadsheetDataset {
    spreadsheetDataset {
      id
      spreadsheetType
      spreadsheetData
    }
    organizations {
      id
      name
      slug
    }
    sdgs {
      id
      name
      slug
      number
    }
    sectors {
      id
      name
      slug
    }
  }
`
