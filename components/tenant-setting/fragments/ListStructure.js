import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { TENANT_SETTINGS_QUERY } from '../../shared/query/tenantSetting'
import { DisplayType } from '../../utils/constants'
import TenantSettingCard from '../TenantSettingCard'

const ListStructure = () => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(TENANT_SETTINGS_QUERY, {
    variables: {
      search
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.tenantSettings) {
    return <NotFound />
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
