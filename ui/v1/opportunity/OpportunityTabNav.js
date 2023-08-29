import { useContext, useEffect, useState } from 'react'
import { OpportunityFilterContext } from '../../../components/context/OpportunityFilterContext'
import TabNav from '../shared/TabNav'
import { ExportType, asyncExport, convertKeys } from '../utils/export'
import { useUser } from '../../../lib/hooks'

const OpportunityTabNav = ({ activeTab, setActiveTab }) => {
  const { user } = useUser()

  const [tabNames, setTabNames] = useState([
    'ui.opportunity.header',
    'ui.opportunity.whatIs'
  ])

  useEffect(() => {
    if (user?.isAdminUser) {
      setTabNames(tabNames => [
        ...tabNames.filter(tabName => tabName !== 'ui.opportunity.createNew'),
        'ui.opportunity.createNew'
      ])
    }
  }, [user])

  const opportunityFilters = useContext(OpportunityFilterContext)

  const exportCsvFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...opportunityFilters })
    asyncExport(ExportType.EXPORT_AS_CSV, 'opportunities', exportParameters, user.userEmail)
  }

  const exportJsonFn = () => {
    const exportParameters = convertKeys({ pageSize: -1, ...opportunityFilters })
    asyncExport(ExportType.EXPORT_AS_JSON, 'opportunities', exportParameters, user.userEmail)
  }

  return (
    <TabNav
      { ...{ tabNames, activeTab, setActiveTab }}
      exportCsvFn={exportCsvFn}
      exportJsonFn={exportJsonFn}
    />
  )
}

export default OpportunityTabNav
