import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { FilterContext } from '../context/FilterContext'
import { PRODUCT_POLICY_QUERY } from '../shared/query/product'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const ProductTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.product.header'
  ])

  useQuery(PRODUCT_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.product.createNew'),
        'ui.product.createNew'
      ])
    }
  })

  const activeFilters = useContext(FilterContext)

  const exportCsvFn = () => {
    const productFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...productFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'products', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const productFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...productFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'products', exportParameters, user.userEmail)
  }

  const generateExportFilters = (activeFilters) => {
    return Object
      .keys(activeFilters)
      .filter(key => {
        return [
          'search',
          'buildingBlocks',
          'countries',
          'isLinkedWithDpi',
          'licenseTypes',
          'origins',
          'sdgs',
          'sectors',
          'showGovStackOnly',
          'showDpgaOnly',
          'tags',
          'useCases',
          'workflows'
        ].indexOf(key) !== -1
      })
      .map(key => ({
        key,
        value: activeFilters[key]
      }))
      .reduce((accumulator, object) => {
        accumulator[object.key] = object.value

        return accumulator
      }, {})
  }

  const createCandidateFn = () => {
    router.push('/candidate/products/create')
  }

  return (
    <TabNav
      {...{ tabNames, activeTab, setActiveTab }}
      createFn={createCandidateFn}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default ProductTabNav
