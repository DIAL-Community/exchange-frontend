import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { CREATING_POLICY_SLUG, GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { useUser } from '../../lib/hooks'
import { FilterContext } from '../context/FilterContext'
import { ORGANIZATION_POLICY_QUERY } from '../shared/query/organization'
import TabNav from '../shared/TabNav'
import { asyncExport, convertKeys, ExportType } from '../utils/export'

const OrganizationTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()
  const router = useRouter()

  const [tabNames, setTabNames] = useState([
    'ui.organization.header'
  ])

  useQuery(ORGANIZATION_POLICY_QUERY, {
    variables: { slug: CREATING_POLICY_SLUG },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.CREATING
      }
    },
    onCompleted: () => {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.organization.createNew'),
        'ui.organization.createNew'
      ])
    }
  })

  const activeFilters = useContext(FilterContext)

  const exportCsvFn = () => {
    const { userEmail, userToken } = user
    const organizationFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...organizationFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'organizations', exportParameters, userEmail, userToken)
  }

  const exportJsonFn = () => {
    const { userEmail, userToken } = user
    const organizationFilters = generateExportFilters(activeFilters)
    const exportParameters = convertKeys({ pageSize: -1, ...organizationFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'organizations', exportParameters, userEmail, userToken)
  }

  const generateExportFilters = (activeFilters) => {
    return Object
      .keys(activeFilters)
      .filter(key => {
        return [
          'search',
          'aggregator',
          'endorser',
          'sectors',
          'countries',
          'years'
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
    router.push('/candidate/organizations/create')
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

export default OrganizationTabNav
