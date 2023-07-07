import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import parse from 'html-react-parser'
import { DisplayType, REBRAND_BASE_PATH } from '../utils/constants'

const UseCaseCard = ({ displayType, index, useCase }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg ${index % 2 === 0 && 'bg-dial-cotton'}`}>
      <div className='flex flex-row gap-x-6'>
        {useCase.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-16 h-16 px-1 py-1 rounded-full bg-dial-blueberry'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
              className='object-contain w-10 h-10 mx-auto my-2 white-filter'
            />
          </div>
        }
        {useCase.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-16 h-16'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
              className='object-contain'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-lg xl:max-w-3xl'>
          <div className='text-lg font-semibold text-dial-blueberry'>
            {useCase.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {parse(useCase?.sanitizedDescription)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdgTarget.header')} ({useCase.sdgTargets?.length ?? 0})
            </div>
            <div className='border border-r border-dial-slate-300' />
            <div className='text-sm'>
              {format('ui.buildingBlock.header')} ({useCase.buildingBlocks?.length ?? 0})
            </div>
          </div>
          <div className='flex text-[10px] text-white'>
            <div className='px-6 py-1 rounded-lg bg-dial-blueberry'>
              {useCase.maturity}
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <Link href={`${REBRAND_BASE_PATH}/use-cases/${useCase.slug}`}>
      {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
    </Link>
  )
}

export default UseCaseCard
