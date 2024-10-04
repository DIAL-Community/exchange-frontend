import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import { TENANT_SETTING_DETAIL_QUERY } from '../shared/query/tenantSetting'
import TenantSettingDetailLeft from './TenantSettingDetailLeft'
import TenantSettingDetailRight from './TenantSettingDetailRight'

const TenantSettingDetail = ({ tenantName }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(TENANT_SETTING_DETAIL_QUERY, {
    variables: { tenantName },
    cache: 'no-cache'
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
    const map = {}
    map[tenantSetting.tenantName] = tenantSetting.tenantName

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <TenantSettingDetailLeft scrollRef={scrollRef} tenantSetting={tenantSetting} />
        </div>
        <div className='lg:basis-2/3'>
          <TenantSettingDetailRight ref={scrollRef} tenantSetting={tenantSetting} />
        </div>
      </div>
    </div>
  )
}

export default TenantSettingDetail
