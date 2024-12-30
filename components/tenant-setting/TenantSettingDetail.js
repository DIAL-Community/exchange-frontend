import { useEffect, useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { TENANT_SETTING_DETAIL_QUERY, TENANT_SETTING_POLICY_QUERY } from '../shared/query/tenantSetting'
import { fetchOperationPolicies } from '../utils/policy'
import TenantSettingDetailLeft from './TenantSettingDetailLeft'
import TenantSettingDetailRight from './TenantSettingDetailRight'

const TenantSettingDetail = ({ tenantName }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(TENANT_SETTING_DETAIL_QUERY, {
    variables: { tenantName },
    cache: 'no-cache',
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  useEffect(() => {
    fetchOperationPolicies(
      client,
      TENANT_SETTING_POLICY_QUERY,
      ['editing', 'deleting']
    ).then(policies => {
      setEditingAllowed(policies['editing'])
      setDeletingAllowed(policies['deleting'])
    })
  }, [client])

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.tenantSetting) {
    return handleMissingData()
  }

  const { tenantSetting } = data

  const slugNameMapping = () => {
    const map = {}
    map[tenantSetting.tenantName] = tenantSetting.tenantName

    return map
  }

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping()}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <TenantSettingDetailLeft scrollRef={scrollRef} tenantSetting={tenantSetting} />
        </div>
        <div className='lg:basis-2/3'>
          <TenantSettingDetailRight
            ref={scrollRef}
            tenantSetting={tenantSetting}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default TenantSettingDetail
