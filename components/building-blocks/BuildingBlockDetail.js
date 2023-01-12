import { useQuery } from '@apollo/client'
import { useRef } from 'react'
import { useUser } from '../../lib/hooks'
import NotFound from '../shared/NotFound'
import { Error, Loading } from '../shared/FetchStatus'
import { BUILDING_BLOCK_DETAIL_QUERY } from '../../queries/building-block'
import BuildingBlockDetailLeft from './BuildingBlockDetailLeft'
import BuildingBlockDetailRight from './BuildingBlockDetailRight'

const BuildingBlockDetail = ({ slug, locale }) => {
  const { loading, error, data } = useQuery(BUILDING_BLOCK_DETAIL_QUERY, {
    variables: { slug },
    context: { headers: { 'Accept-Language': locale } },
    skip: !slug
  })

  const { isAdminUser: canEdit } = useUser()

  const commentsSectionElement = useRef()

  if (loading) {
    return <Loading />
  } else if (error && error.networkError) {
    return <Error />
  } else if (error && !error.networkError) {
    return <NotFound />
  }

  return (
    <>
      {
        data && data.buildingBlock &&
          <div className='flex flex-col lg:flex-row pb-8'>
            <div className='relative lg:sticky lg:top-66px w-full lg:w-1/3 xl:w-1/4 h-full py-4 px-4'>
              <BuildingBlockDetailLeft
                buildingBlock={data.buildingBlock}
                commentsSectionRef={commentsSectionElement}
              />
            </div>
            <div className='w-full lg:w-2/3 xl:w-3/4'>
              <BuildingBlockDetailRight
                buildingBlock={data.buildingBlock}
                canEdit={canEdit}
                commentsSectionRef={commentsSectionElement}
              />
            </div>
          </div>
      }
    </>
  )
}

export default BuildingBlockDetail
