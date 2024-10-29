import { useEffect, useRef, useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import Breadcrumb from '../shared/Breadcrumb'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { SITE_SETTING_DETAIL_QUERY, SITE_SETTING_POLICY_QUERY } from '../shared/query/siteSetting'
import { fetchOperationPolicies } from '../utils/policy'
import SiteSettingDetailLeft from './SiteSettingDetailLeft'
import SiteSettingDetailRight from './SiteSettingDetailRight'

const SiteSettingDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const client = useApolloClient()

  const [editingAllowed, setEditingAllowed] = useState(false)
  const [deletingAllowed, setDeletingAllowed] = useState(false)

  const { loading, error, data } = useQuery(SITE_SETTING_DETAIL_QUERY, {
    variables: { slug },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  useEffect(() => {
    fetchOperationPolicies(
      client,
      SITE_SETTING_POLICY_QUERY,
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
  } else if (!data?.siteSetting) {
    return handleMissingData()
  }

  const { siteSetting } = data

  const slugNameMapping = (() => {
    const map = {}
    map[siteSetting.slug] = siteSetting.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3 shrink-0'>
          <SiteSettingDetailLeft scrollRef={scrollRef} siteSetting={siteSetting} />
        </div>
        <div className='lg:basis-2/3 shrink-0'>
          <SiteSettingDetailRight
            ref={scrollRef}
            siteSetting={siteSetting}
            editingAllowed={editingAllowed}
            deletingAllowed={deletingAllowed}
          />
        </div>
      </div>
    </div>
  )
}

export default SiteSettingDetail
