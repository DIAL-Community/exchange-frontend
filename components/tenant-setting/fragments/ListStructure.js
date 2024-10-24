import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { TENANT_SETTINGS_QUERY } from '../../shared/query/tenantSetting'
import { DisplayType } from '../../utils/constants'
import TenantSettingCard from '../TenantSettingCard'

const ListStructure = () => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(TENANT_SETTINGS_QUERY, {
    variables: {
      search
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.tenantSettings) {
    return handleMissingData()
  }

  const { tenantSettings } = data

  return (
    <div className='flex flex-col gap-3'>
      {tenantSettings.map((tenantSetting, index) =>
        <div key={index}>
          <TenantSettingCard
            index={index}
            tenantSetting={tenantSetting}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
