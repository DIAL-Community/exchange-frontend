import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../../shared/GraphQueryHandler'
import { ORGANIZATION_DETAIL_QUERY } from '../../../shared/query/organization'
import Breadcrumb from '../../shared/Breadcrumb'
import OrganizationDetailLeft from './OrganizationDetailLeft'
import OrganizationDetailRight from './OrganizationDetailRight'

const OrganizationDetail = ({ slug }) => {
  const scrollRef = useRef(null)

  const { loading, error, data } = useQuery(ORGANIZATION_DETAIL_QUERY, {
    variables: { slug },
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
  } else if (!data?.organization) {
    return handleMissingData()
  }

  const { organization } = data

  const slugNameMapping = (() => {
    const map = {}
    map[organization.slug] = organization.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className="py-6 text-dial-stratos z-40">
        <Breadcrumb slugNameMapping={slugNameMapping}/>
        <hr className="border-b border-health-gray my-3"/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <OrganizationDetailLeft scrollRef={scrollRef} organization={organization}/>
        </div>
        <div className='lg:basis-2/3'>
          <OrganizationDetailRight ref={scrollRef} organization={organization}/>
        </div>
      </div>
    </div>
  )
}

export default OrganizationDetail
