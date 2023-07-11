import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const SdgTargetCard = ({ displayType, index, sdgTarget }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const filename = `0${sdgTarget.sdg.number}`.slice(-2)

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-cotton'}`}>
      <div className='flex flex-row gap-x-6'>
        <img
          src={`/assets/sdg/sdg_${filename}.png`}
          alt={format('ui.image.logoAlt', { name:  format('ui.sdgTarget.header') })}
          width={70}
          height={70}
          className='object-contain'
        />
        <div className='flex flex-col gap-y-3'>
          <div className='text-lg font-semibold text-dial-blueberry'>
            {sdgTarget.name}
          </div>
          <div className='line-clamp-4 max-w-3xl'>
            {parse(sdgTarget?.sanitizedDescription)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdgTarget.header')} ({sdgTarget.sdgTargets?.length ?? 0})
            </div>
            <div className='border border-r border-dial-slate-300' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({sdgTarget.buildingBlocks?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='flex flex-row gap-x-3 px-6'>
      <div className='basis-1/6'>
        <img
          src={`/assets/sdg/sdg_${filename}.png`}
          alt={format('ui.image.logoAlt', { name:  format('ui.sdg.header') })}
          className='object-contain w-32 h-32'
        />
      </div>
      <div className='basis-5/6'>
        <div className='flex flex-col gap-y-1'>
          <div className='font-semibold text-dial-blueberry pt-1 pb-3'>
            {`${sdgTarget.sdg.number}. ${sdgTarget.sdg.name}`}
          </div>
          <div className='text-sm font-semibold text-dial-blueberry my-auto'>
            {`${format('ui.sdgTarget.target')} ${sdgTarget.targetNumber}`}
          </div>
          <div className='text-sm text-dial-stratos my-auto'>
            {sdgTarget.name}
          </div>
        </div>
      </div>
    </div>

  return (
    <Link href={`${REBRAND_BASE_PATH}/sdg-targets/${sdgTarget.sdg.slug}`}>
      {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
      {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
    </Link>
  )
}

export default SdgTargetCard
