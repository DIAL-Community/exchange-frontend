import { useQuery } from '@apollo/client'
import { useEffect, useRef } from 'react'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { OPPORTUNITY_QUERY } from '../../queries/opportunity'
import OpportunityDetailLeft from './OpportunityDetailLeft'
import OpportunityDetailRight from './OpportunityDetailRight'

const OpportunityDetail = ({ slug, locale }) => {
  const commentsSectionElement = useRef()

  const { loading, error, data, refetch } = useQuery(OPPORTUNITY_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  useEffect(() => {
    refetch()
  }, [locale, refetch])

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.opportunity) {
    return <NotFound />
  }

  return (
    <>
      {
        data?.opportunity &&
          <div className='flex flex-col lg:flex-row justify-between pb-8'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <OpportunityDetailLeft
                opportunity={data.opportunity}
                commentsSectionRef={commentsSectionElement}
              />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <OpportunityDetailRight
                opportunity={data.opportunity}
                commentsSectionRef={commentsSectionElement}
              />
            </div>
          </div>
      }
    </>
  )
}

export default OpportunityDetail
