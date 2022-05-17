import { createRef, Fragment, useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import { Error, Loading } from '../shared/FetchStatus'
import NotFound from '../shared/NotFound'
import { convertToKey } from '../context/FilterContext'
import { DEFAULT_SHEET_HEADERS, DEFAULT_SHEET_NAMES, mapSpreadsheetData } from './DatasetSpreadsheetConfig'
import 'handsontable/dist/handsontable.full.css'

const DEFAULT_PAGE_SIZE = 20
const DATASET_SPREADSHEET_QUERY = gql`
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

const DATASET_SPREADSHEET_MUTATION = gql`
  mutation (
    $spreadsheetData: JSON!,
    $spreadsheetType: String!,
    $assoc: String
  ) {
      createSpreadsheetData(
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

registerAllModules()

const DatasetSpreadsheet = () => {
  const [hotRefs, setHotRefs] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { locale } = useRouter()
  const [session] = useSession()

  const [createSpreadsheetData] = useMutation(DATASET_SPREADSHEET_MUTATION)
  const [saveSpreadsheetData] = useMutation(DATASET_SPREADSHEET_MUTATION, {
    refetchQueries: [
      DATASET_SPREADSHEET_QUERY,
      'SpreadsheetDataset'
    ]
  })

  const { loading, error, data } = useQuery(DATASET_SPREADSHEET_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
    }
  })

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

  const buildData = (rowData, changes) => {
    const [rowChanges] = changes
    const data = {
      name: rowData[0],
      changes: rowChanges.map(x => typeof x === 'undefined' || x === null ? '' : x )
    }

    // The locale field for description is needed to assign the correct description locale.
    if (selectedIndex === 1) {
      data.locale = rowData[1]
    }

    return data
  }

  const afterChangeHandler = (changes, source) => {
    const currentHotRef = hotRefs[selectedIndex].current
    if (currentHotRef && changes && session) {
      // The form of 'changes' is array of array. The first element:
      // [rowIndex, columnIndex, previousValue, currentValue]
      const [currentChange] = changes
      const updatedColumnIndex = parseInt(currentChange[1])
      if (updatedColumnIndex > 0) {
        const updatedRowIndex = parseInt(currentChange[0])
        const rowData = currentHotRef.hotInstance.getDataAtRow(updatedRowIndex)
        const variables = {
          spreadsheetType: 'dataset',
          spreadsheetData: buildData(rowData, changes),
          assoc: convertToKey(DEFAULT_SHEET_NAMES[selectedIndex])
        }
        const { userEmail, userToken } = session.user
        saveSpreadsheetData({
          variables,
          context: {
            headers: {
              'Accept-Language': locale,
              Authorization: `${userEmail} ${userToken}`
            }
          }
        })
      }
    }
  }

  const columnsUsingGraphData = (data, hotIndex) => {
    if (hotIndex === 2) {
      return [
        {},
        {
          type: 'autocomplete',
          source: data.organizations.map(organization => organization.name),
          strict: false,
          visibleRows: 5
        }
      ]
    } else if (hotIndex === 3) {
      return [
        {},
        {
          type: 'autocomplete',
          source: data.sdgs.map(sdg => sdg.name),
          strict: false,
          visibleRows: 5
        }
      ]
    } else if (hotIndex === 4) {
      return [
        {},
        {
          type: 'autocomplete',
          source: data.sectors.map(sector => sector.name),
          strict: false,
          visibleRows: 5
        }
      ]
    }
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

  const { spreadsheetDataset } = data

  return (
    <div className='w-full'>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className='flex flex px-8 bg-dial-gray-dark'>
          {DEFAULT_SHEET_NAMES.map((name) => (
            <Tab key={name} as={Fragment}>
              {({ selected }) => (
                <div
                  className={
                    classNames(
                      'w-40 px-3 py-2.5 text-sm leading-5 font-medium text-white text-center',
                      selected
                        ? 'border-b-4 border-green-500'
                        : 'hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  {name}
                </div>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='pt-2 pl-8 pr-4' style={{ minHeight: '70vh'}}>
          {DEFAULT_SHEET_HEADERS.map((header, index) => (
            <Tab.Panel key={index}>
              <HotTable
                colHeaders={header}
                columns={columnsUsingGraphData(data, index)}
                contextMenu
                data={mapSpreadsheetData(spreadsheetDataset, index)}
                licenseKey='non-commercial-and-evaluation'
                manualColumnResize
                manualRowResize
                ref={hotRefs[index]}
                rowHeaders={true}
                stretchH='all'
                width='100%'
                style={{ zIndex: 19 }}
                afterChange={afterChangeHandler}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default DatasetSpreadsheet
