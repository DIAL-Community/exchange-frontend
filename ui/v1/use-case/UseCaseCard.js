import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import classNames from 'classnames'
import parse from 'html-react-parser'
import { IoClose } from 'react-icons/io5'
import { DisplayType } from '../utils/constants'

const UseCaseCard = ({ displayType, index, useCase, dismissCardHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-cotton'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {useCase.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-16 h-16 mx-auto px-1 py-1 rounded-full bg-dial-blueberry'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
              className='object-contain w-10 h-10 mx-auto my-2 white-filter'
            />
          </div>
        }
        {useCase.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-16 h-16 mx-auto'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.useCase.label') })}
              className='object-contain'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
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

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-workflow-bg-light to-workflow-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full text-dial-blueberry text-sm'>
        <div className='rounded-full bg-dial-blueberry w-10 h-10 my-auto min-w-[2.5rem]'>
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.header') })}
            className={classNames(
              'object-contain mx-auto',
              useCase.imageFile.indexOf('placeholder.svg') <= 0 ? 'w-6 h-6 my-2 white-filter' : ''
            )}
          />
        </div>
        <div className='font-semibold my-auto'>
          {useCase.name}
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/use-cases/${useCase.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      {dismissCardHandler && {}.toString.call(dismissCardHandler) === '[object Function]' &&
        <button type='button' className='absolute p-2 top-0 right-0 text-dial-sapphire'>
          <IoClose size='1rem' onClick={dismissCardHandler} />
        </button>
      }
    </div>
  )
}

export default UseCaseCard
