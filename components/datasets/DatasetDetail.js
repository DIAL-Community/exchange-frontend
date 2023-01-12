import { useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { DATASET_QUERY } from '../../queries/dataset'
import DatasetDetailLeft from './DatasetDetailLeft'
import DatasetDetailRight from './DatasetDetailRight'

const DatasetDetail = ({ slug, locale }) => {

  const { loading, error, data, refetch } = useQuery(DATASET_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  const commentsSectionElement = useRef()

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  const { dataset } = data

  return (
    <>
      {
        dataset &&
          <div className='flex flex-col lg:flex-row justify-between pb-8'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <DatasetDetailLeft dataset={dataset} commentsSectionRef={commentsSectionElement} />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <DatasetDetailRight dataset={dataset} commentsSectionRef={commentsSectionElement} />
            </div>
          </div>
      }
    </>
  )
}

export default DatasetDetail
