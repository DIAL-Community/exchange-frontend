import { useQuery } from '@apollo/client'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { RESOURCE_DETAIL_QUERY } from '../../queries/resource'
import ResourceDetailLeft from './ResourceDetailLeft'
import ResourceDetailRight from './ResourceDetailRight'

const ResourceDetail = ({ slug, locale }) => {
  const { loading, error, data } = useQuery(RESOURCE_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.resource) {
    return <NotFound />
  }

  return (
    <>
      {
        data?.resource &&
          <div className='flex flex-col lg:flex-row justify-between pb-8'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <ResourceDetailLeft resource={data.resource} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <ResourceDetailRight resource={data.resource} />
            </div>
          </div>
      }
    </>
  )
}

export default ResourceDetail
