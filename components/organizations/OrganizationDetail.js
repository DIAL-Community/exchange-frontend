import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { ORGANIZATION_QUERY } from '../../queries/organization'
import OrganizationDetailLeft from './OrganizationDetailLeft'
import OrganizationDetailRight from './OrganizationDetailRight'

const OrganizationDetail = ({ slug, locale }) => {
  const { loading, error, data, refetch } = useQuery(ORGANIZATION_QUERY, {
    variables: { slug: slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  return (
    <>
      {loading && <Loading />}
      {error && error.networkError && <Error />}
      {error && !error.networkError && <NotFound />}
      {
        data && data.organization &&
          <div className='flex flex-col lg:flex-row justify-between pb-8 max-w-catalog mx-auto'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <OrganizationDetailLeft organization={data.organization} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <OrganizationDetailRight organization={data.organization} />
            </div>
          </div>
      }
    </>
  )
}

export default OrganizationDetail
