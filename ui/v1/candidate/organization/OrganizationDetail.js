import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { ORGANIZATION_DETAIL_QUERY } from '../../shared/query/organization'
import Breadcrumb from '../../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import OrganizationDetailRight from './OrganizationDetailRight'
import OrganizationDetailLeft from './OrganizationDetailLeft'

const OrganizationDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const commentsSectionRef = useRef(null)

  const { loading, error, data } = useQuery(ORGANIZATION_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.organization) {
    return <NotFound />
  }

  const { organization } = data

  const slugNameMapping = (() => {
    const map = {}
    map[organization.slug] = organization.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-violet text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <OrganizationDetailLeft scrollRef={scrollRef} organization={organization} />
        </div>
        <div className='lg:basis-2/3'>
          <OrganizationDetailRight ref={scrollRef} commentsSectionRef={commentsSectionRef} organization={organization} />
        </div>
      </div>
    </div>
  )
}

export default OrganizationDetail
