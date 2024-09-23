import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { CANDIDATE_RESOURCE_DETAIL_QUERY } from '../../shared/query/candidateResource'
import ResourceForm from './fragments/ResourceForm'
import ResourceEditLeft from './ResourceEditLeft'

const ResourceEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(CANDIDATE_RESOURCE_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.candidateResource) {
    return <NotFound />
  }

  const { candidateResource } = data

  const slugNameMapping = (() => {
    const map = {
      edit: format('app.edit')
    }
    map[candidateResource.slug] = candidateResource.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <ResourceEditLeft candidateResource={candidateResource} />
        </div>
        <div className='lg:basis-2/3'>
          <ResourceForm candidateResource={candidateResource} />
        </div>
      </div>
    </div>
  )
}

export default ResourceEdit
