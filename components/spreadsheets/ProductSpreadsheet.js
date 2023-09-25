import { createRef, Fragment, useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ContextMenu } from 'handsontable/plugins'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import { useUser } from '../../lib/hooks'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { PRODUCT_SPREADSHEET_QUERY } from '../shared/query/spreadsheet'
import { CREATE_SPREADSHEET_MUTATION, DELETE_SPREADSHEET_MUTATION } from '../shared/mutation/spreadsheet'
import {
  COLUMN_SOURCE_KEYS,
  DEFAULT_SHEET_HEADERS,
  DEFAULT_SHEET_NAMES,
  PRODUCT_COLUMN_DEFINITION,
  mapSpreadsheetData
} from './ProductSpreadsheetConfig'

registerAllModules()

const ProductSpreadsheet = () => {
  const [hotRefs, setHotRefs] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { locale } = useRouter()
  const { user } = useUser()

  const [updateAssocData] = useMutation(CREATE_SPREADSHEET_MUTATION)
  const [saveSpreadsheetData] = useMutation(CREATE_SPREADSHEET_MUTATION, { refetchQueries: [PRODUCT_SPREADSHEET_QUERY] })
  const [deleteSpreadsheetData] = useMutation(DELETE_SPREADSHEET_MUTATION, { refetchQueries: [PRODUCT_SPREADSHEET_QUERY] })

  const { loading, error, data } = useQuery(PRODUCT_SPREADSHEET_QUERY)

  useEffect(() => {
    // Init the list of all handsontable refs element.
    // We can only access data of the table through this refs.
    // See: https://handsontable.com/docs/react-hot-reference/
    setHotRefs((hotRefs) =>
      Array(DEFAULT_SHEET_NAMES.length)
        .fill()
        .map((_, i) => hotRefs[i] || createRef())
    )
  }, [])

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
  }

  const saveChanges = (spreadsheetData, mutationFunction, onCompleteCallback) => {
    const variables = {
      spreadsheetData,
      spreadsheetType: 'product',
      assoc: COLUMN_SOURCE_KEYS[selectedIndex]
    }
    const { userEmail, userToken } = user
    mutationFunction.apply(this, [{
      variables,
      context: {
        headers: {
          'Accept-Language': locale,
          Authorization: `${userEmail} ${userToken}`
        }
      },
      onCompleted: () => {
        if (onCompleteCallback) {
          onCompleteCallback()
        }
      }
    }])
  }

  const assocChangeHandler = (changes) => {
    changes.map(change => {
      // Change format: [rowIndex, columnIndex, beforeValue, afterValue]
      const [rowIndex, columnIndex] = change
      if (columnIndex === 0) {
        // Don't try to save if we only have the first column (product name).
        return
      }

      // Change is a structure of: [row, column, prevValue, currentValue]
      const currentHotRef = hotRefs[selectedIndex].current.hotInstance
      const rowData = currentHotRef.getDataAtRow(rowIndex)

      const [productName] = rowData
      const spreadsheetData = {
        name: productName,
        changes: change.map(x => typeof x === 'undefined' || x === null ? '' : x)
      }
      saveChanges(spreadsheetData, updateAssocData)
    })
  }

  const mainEntityChangeHandler = (changes) => {
    changes.map(change => {
      // Change format: [rowIndex, columnIndex, beforeValue, afterValue]
      const [rowIndex] = change
      const currentHotRef = hotRefs[selectedIndex].current.hotInstance
      const rowData = currentHotRef.getDataAtRow(rowIndex)

      const [productName] = rowData
      const spreadsheetData = {
        name: productName,
        changes: rowData.map(x => typeof x === 'undefined' || x === null ? '' : x)
      }
      saveChanges(spreadsheetData, saveSpreadsheetData)
    })
  }

  // Converter for copy-paste. Assoc changes will send changes per column, so we need to create
  // one changes per column per row.
  const savePastedAssocChanges = (dataToConvert, coordinates) => {
    const currentHotRef = hotRefs[selectedIndex].current.hotInstance
    coordinates.map(coordinate => {
      for (let i = coordinate.startRow; i <= coordinate.endRow; i++) {
        // Update current row with the new values and save them to the database.
        const currentRowData = currentHotRef.getDataAtRow(i)
        if (currentRowData) {
          for (let j = coordinate.startCol; j <= coordinate.endCol; j++) {
            if (j < currentRowData.length) {
              // Only update array within the current row data.
              currentRowData[j] = dataToConvert[i - coordinate.startRow][j - coordinate.startCol]
            }
          }

          const [productName, secondColumnData, thirdColumnData] = currentRowData
          if (productName) {
            const spreadsheetData = {
              name: productName,
              changes: [i, 1, '', secondColumnData]
            }
            if (thirdColumnData) {
              // This is to handle locale and description on the same column. The rest only 2 columns.
              saveChanges(spreadsheetData, updateAssocData, () => {
                const spreadsheetData = {
                  name: productName,
                  changes: [i, 2, '', thirdColumnData]
                }
                saveChanges(spreadsheetData, updateAssocData)
              })
            } else {
              saveChanges(spreadsheetData, updateAssocData)
            }
          }
        }
      }
    })
  }

  // Converter for copy-paste. Entity changes will send the whole row, so we only need to create
  // one changes per pasted row.
  const savePastedMainEntityChanges = (dataToConvert, coordinates) => {
    const currentHotRef = hotRefs[selectedIndex].current.hotInstance
    coordinates.map(coordinate => {
      for (let i = coordinate.startRow; i <= coordinate.endRow; i++) {
        // Update current row with the new values and save them to the database.
        const currentRowData = currentHotRef.getDataAtRow(i)
        if (currentRowData) {
          for (let j = coordinate.startCol; j <= coordinate.endCol; j++) {
            if (j < currentRowData.length) {
              // Only update array within the current row data.
              currentRowData[j] = dataToConvert[i - coordinate.startRow][j - coordinate.startCol]
            }
          }

          const [productName] = currentRowData
          if (productName) {
            const spreadsheetData = {
              name: productName,
              changes: currentRowData.map(x => typeof x === 'undefined' || x === null ? '' : x)
            }
            saveChanges(spreadsheetData, saveSpreadsheetData)
          }
        }
      }
    })
  }

  // Handlers definition:

  // Handle copy and paste operation. Data will be pasted data, coordinates will be the coordinate
  // of the copy and paste operation.
  const afterPasteHandler = (data, coordinates) => {
    if (selectedIndex > 0) {
      savePastedAssocChanges(data, coordinates)
    } else {
      savePastedMainEntityChanges(data, coordinates)
    }
  }

  // Limitation:
  // * If you enter product name only on association tabs and tabbing out, that row will be deleted.
  // * On description, if you created 2 or more rows with identical value, the handler will confuse.
  //   -> Workaround for this is to enter the correct value again.
  const COPY_PASTE_SOURCE = 'CopyPaste.paste'
  const afterChangeHandler = (changes, source) => {
    if (source === COPY_PASTE_SOURCE) {
      // We're not handling the changes from pasting here.
      return
    }

    // Products and pricing is handled by the save because they're part of the main product object.
    if (changes) {
      if (selectedIndex > 0) {
        assocChangeHandler(changes)
      } else {
        mainEntityChangeHandler(changes)
      }
    }
  }

  const beforeRemoveRowHandler = (_index, _amount, physicalRows) => {
    if (physicalRows) {
      const currentHotRef = hotRefs[selectedIndex].current.hotInstance
      physicalRows.map(physicalRow => {
        const rowData = currentHotRef.getDataAtRow(physicalRow)

        const [productName] = rowData
        const spreadsheetData = {
          name: productName,
          changes: rowData.map(x => typeof x === 'undefined' || x === null ? '' : x)
        }
        saveChanges(spreadsheetData, deleteSpreadsheetData)
      })
    }

    return false
  }

  // Define autocomplete of some columns (sector name, etc).
  const columnsUsingGraphData = (data, hotIndex) => {
    let source = null
    if (hotIndex === 0) {
      // Main product page column configuration. The last column is a select of true and false.
      // Using autocomplete because the styling for type 'checkbox' or 'select' is clashing with
      // default styling and looks confusing.
      return PRODUCT_COLUMN_DEFINITION
        .map((_column, columnIndex) => {
          return columnIndex < PRODUCT_COLUMN_DEFINITION.length - 1 ?
            {} :
            {
              type: 'autocomplete',
              strict: true,
              source: ['false', 'true']
            }
        })
    } else if (data[COLUMN_SOURCE_KEYS[hotIndex]]) {
      source = data[COLUMN_SOURCE_KEYS[hotIndex]].map(e => e.name)
    }

    const autoCompleteConfig = {
      type: 'autocomplete',
      source,
      strict: false,
      visibleRows: 5
    }

    return source ? [{}, { ...autoCompleteConfig }] : null
  }

  // Loading and error handler section.
  if (loading) {
    return <Loading />
  } else if (error) {
    if (error.networkError) {
      return <Error />
    } else {
      return <NotFound />
    }
  }

  const { spreadsheetProduct } = data

  const contextMenuConfig = {
    items: {
      row_above: {},
      multi_row_above: {
        name: 'Insert 10 row above',
        callback: () => {
          const currentHot = hotRefs[selectedIndex].current.hotInstance
          // Get selected return array of array. We will use the first selected row as reference.
          const [selected] = currentHot.getSelected()
          const [rowIndex] = selected
          currentHot.alter('insert_row', rowIndex, 10)
        }
      },
      first_separator: ContextMenu.SEPARATOR,
      row_below: {},
      multi_row_below: {
        name: 'Insert 10 row below',
        callback: () => {
          const currentHot = hotRefs[selectedIndex].current.hotInstance
          // Get selected return array of array. We will use the first selected row as reference.
          const [selected] = currentHot.getSelected()
          const [rowIndex] = selected
          currentHot.alter('insert_row', rowIndex + 1, 10)
        }
      },
      second_separator: ContextMenu.SEPARATOR,
      remove_row: {},
      third_separator: ContextMenu.SEPARATOR,
      copy: {}
    }
  }

  return (
    <div className='px-4 lg:px-8 xl:px-56'>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className='flex flex bg-dial-meadow'>
          {DEFAULT_SHEET_NAMES.map((name) => (
            <Tab key={name} as={Fragment}>
              {({ selected }) => (
                <div
                  className={
                    classNames(
                      'px-5 2xl:px-8 py-3 text-sm font-medium text-white text-center',
                      selected
                        ? 'border-b-4 border-green-500'
                        : 'cursor-pointer hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  {name}
                </div>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {DEFAULT_SHEET_HEADERS.map((header, index) => (
            <Tab.Panel key={index}>
              <HotTable
                id='product-spreadsheet'
                colHeaders={header}
                columns={columnsUsingGraphData(data, index)}
                contextMenu={contextMenuConfig}
                data={mapSpreadsheetData(spreadsheetProduct, index)}
                licenseKey='non-commercial-and-evaluation'
                manualColumnResize
                manualRowResize
                ref={hotRefs[index]}
                rowHeaders={true}
                stretchH='all'
                width='100%'
                height='70vh'
                style={{ zIndex: 19 }}
                afterChange={afterChangeHandler}
                afterPaste={afterPasteHandler}
                beforeRemoveRow={beforeRemoveRowHandler}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default ProductSpreadsheet
