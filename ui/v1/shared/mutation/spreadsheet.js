import { gql } from '@apollo/client'

export const CREATE_SPREADSHEET_MUTATION = gql`
  mutation (
    $spreadsheetData: JSON!,
    $spreadsheetType: String!,
    $assoc: String
  ) {
    createSpreadsheetData (
      spreadsheetData: $spreadsheetData,
      spreadsheetType: $spreadsheetType,
      assoc: $assoc
    ) {
      dialSpreadsheetData {
        id
        spreadsheetType
        spreadsheetData
      }
      errors
    }
  }
`

export const DELETE_SPREADSHEET_MUTATION = gql`
  mutation (
    $spreadsheetData: JSON!,
    $spreadsheetType: String!,
    $assoc: String
  ) {
    deleteSpreadsheetData (
      spreadsheetData: $spreadsheetData,
      spreadsheetType: $spreadsheetType,
      assoc: $assoc
    ) {
      dialSpreadsheetData {
        id
        spreadsheetType
        spreadsheetData
      }
      errors
    }
  }
`
