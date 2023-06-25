import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const DatasetCard = ({ displayType, index, dataset }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-cotton'}`}>
      <div className='flex flex-row gap-x-6'>
        <img
          // src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
          src='/ui/v1/dataset-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.dataset.header') })}
          width={70}
          height={70}
          className='object-contain'
        />
        <div className='flex flex-col gap-y-3'>
          <div className='text-lg font-semibold text-dial-meadow'>
            {dataset.name}
          </div>
          <div className='line-clamp-4 max-w-3xl'>
            {dataset?.datasetDescription && parse(dataset?.datasetDescription?.description)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdgTarget.header')} ({dataset.sdgTargets?.length ?? 0})
            </div>
            <div className='border border-r border-dial-slate-300' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({dataset.buildingBlocks?.length ?? 0})
            </div>
          </div>
          <div className='flex text-[10px] text-white'>
            <div className='px-6 py-1 rounded-lg bg-dial-slate-500'>
              {dataset.maturity}
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-dataset-bg-light to-dataset-bg'>
      <div className='flex flex-row gap-x-3 px-6 py-3'>
        <img
          // src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
          src='/ui/v1/product-header.svg'
          alt={format('ui.image.logoAlt', { name: format('ui.dataset.header') })}
          width={40}
          height={40}
          className='object-contain'
        />
        <div className='text-sm font-semibold text-dial-meadow my-auto'>
          {dataset.name}
        </div>
      </div>
    </div>

  return (
    <Link href={`${REBRAND_BASE_PATH}datasets/${dataset.slug}`}>
      {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
    </Link>
  )
}

export default DatasetCard
