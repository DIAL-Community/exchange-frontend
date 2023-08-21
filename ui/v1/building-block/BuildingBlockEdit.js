import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { BUILDING_BLOCK_DETAIL_QUERY } from '../shared/query/buildingBlock'
import Breadcrumb from '../shared/Breadcrumb'
import { Error, Loading, NotFound } from '../shared/FetchStatus'
import BuildingBlockForm from './fragments/BuildingBlockForm'
import BuildingBlockEditLeft from './BuildingBlockEditLeft'

const BuildingBlockEdit = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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
    const map = {
      edit: format('app.edit')
    }
    map[buildingBlock.slug] = data.buildingBlock.name

    return map
  })()

  return (
    <div className='lg:px-8 xl:px-56 flex flex-col'>
      <div className='px-4 lg:px-6 py-4 bg-dial-blue-chalk text-dial-stratos ribbon-detail z-40'>
        <Breadcrumb slugNameMapping={slugNameMapping}/>
      </div>
      <div className='flex flex-col lg:flex-row gap-x-8'>
        <div className='lg:basis-1/3'>
          <BuildingBlockEditLeft buildingBlock={buildingBlock} />
        </div>
        <div className='lg:basis-2/3'>
          <BuildingBlockForm buildingBlock={buildingBlock} />
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockEdit
