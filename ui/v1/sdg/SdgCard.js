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
          src={`/assets/sdg/sdg_${('0' + sdg.number).slice(-2)}.png`}
          alt={format('ui.image.logoAlt', { name:  format('ui.sdg.header') })}
          width={70}
          height={70}
          className='object-contain'
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
    <div className='rounded-lg bg-gradient-to-r from-building-block-bg-light to-building-block-bg'>
      <div className='flex flex-row gap-x-3 px-6 py-3'>
        <img
          src={`/assets/sdg/sdg_${('0' + sdg.number).slice(-2)}.png`}
          alt={format('ui.image.logoAlt', { name:  format('ui.sdg.header') })}
          width={40}
          height={40}
          className='object-contain'
        />
        <div className='text-sm font-semibold text-dial-ochre my-auto'>
          {sdg.name}
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
