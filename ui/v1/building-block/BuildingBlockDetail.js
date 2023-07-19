import { useRef } from 'react'
import { useQuery } from '@apollo/client'
import { BUILDING_BLOCK_DETAIL_QUERY } from '../shared/query/buildingBlock'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import BuildingBlockDetailRight from './BuildingBlockDetailRight'
import BuildingBlockDetailLeft from './BuildingBlockDetailLeft'

const BuildingBlockDetail = ({ slug }) => {
  const scrollRef = useRef(null)
  const commentsSectionRef = useRef(null)

  const { loading, error, data } = useQuery(BUILDING_BLOCK_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.buildingBlock) {
    return <NotFound />
  }

  const { buildingBlock } = data

  const slugNameMapping = (() => {
    const map = {}
    map[buildingBlock.slug] = buildingBlock.name

    return map
  })()

  return (
    <div className='px-8 xl:px-56 flex flex-col'>
      <div className='px-6 py-4 bg-dial-warm-beech text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-row gap-x-8'>
        <div className='basis-1/3'>
          <BuildingBlockDetailLeft scrollRef={scrollRef} buildingBlock={buildingBlock} />
        </div>
        <div className='basis-2/3'>
          <BuildingBlockDetailRight
            ref={scrollRef}
            commentsSectionRef={commentsSectionRef}
            buildingBlock={buildingBlock}
          />
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockDetail
