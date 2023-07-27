import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const SdgCard = ({ displayType, index, sdg }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-cotton'}`}>
      <div className='flex flex-row gap-x-6'>
        <img
          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
          alt={format('ui.image.logoAlt', { name:  format('ui.sdg.header') })}
          width={70}
          height={70}
        />
        <div className='flex flex-col gap-y-3'>
          <div className='text-lg font-semibold text-dial-blueberry'>
            {sdg.name}
          </div>
          <div className='line-clamp-4 max-w-3xl'>
            {parse(sdg?.sanitizedDescription)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdg.header')} ({sdg.sdgs?.length ?? 0})
            </div>
            <div className='border border-r border-dial-slate-300' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({sdg.buildingBlocks?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='flex flex-row gap-x-3 px-6'>
      <div className='basis-1/6'>
        <img
          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
          alt={format('ui.image.logoAlt', { name:  format('ui.sdg.header') })}
          className='object-contain w-24 h-24'
        />
      </div>
      <div className='basis-5/6'>
        <div className='flex flex-col gap-y-1'>
          <div className='text-sm font-semibold text-dial-meadow my-auto py-1'>
            {`${sdg.number} .${sdg.name}`}
          </div>
          <div className='text-xs text-dial-stratos my-auto flex flex-row gap-x-2'>
            ({sdg.sdgTargets.length} {format('ui.sdgTarget.header')})
            <div className='inline border-b border-dial-iris-blue'>Learn more about this</div>
          </div>
        </div>
      </div>
    </div>

  return (
    <Link href={`${REBRAND_BASE_PATH}/sdgs/${sdg.slug}`}>
      {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
    </Link>
  )
}

export default SdgCard
