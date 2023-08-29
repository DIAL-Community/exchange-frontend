export const convertToKey = (s) => {
  return s
    .replace(/\s+/g, '_')
    .toLowerCase()
    .replace(/[-_]\w/ig, (match) => match.charAt(1).toUpperCase())
}

// Create the minimum row (1 row) when there's no data for the sheet.
export const MINIMUM_ROW_COUNT = 1
export const createSpreadsheetData = (rowCount, columnCount) => {
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
