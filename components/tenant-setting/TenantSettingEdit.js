import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { TENANT_SETTING_DETAIL_QUERY } from '../shared/query/tenantSetting'
import TenantSettingForm from './fragments/TenantSettingForm'
import TenantSettingEditLeft from './TenantSettingEditLeft'

const TenantSettingEdit = ({ tenantName }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(TENANT_SETTING_DETAIL_QUERY, {
    variables: { tenantName }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.tenantSetting) {
    return <NotFound />
  }

  const { tenantSetting } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[tenantSetting.tenantName] = tenantSetting.tenantName

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <TenantSettingEditLeft tenantSetting={tenantSetting} />
        </div>
        <div className='lg:basis-2/3'>
          <TenantSettingForm tenantSetting={tenantSetting} />
        </div>
      </div>
    </div>
  )
}

export default TenantSettingEdit
