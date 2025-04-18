import { useCallback } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const UseCaseCard = ({ displayType, index, useCase, dismissHandler }) => {
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
            {useCase?.parsedDescription && parse(useCase?.parsedDescription)}
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
          <div className='flex gap-2 text-xs text-white'>
            {useCase.govStackEntity &&
              <div className='border border-dial-iris-blue text-dial-iris-blue rounded px-6 py-1'>
                {format('govstack.label').toUpperCase()}
              </div>
            }
            <div className='px-6 py-1 rounded bg-dial-blueberry'>
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

  const displayGridCard = () => (
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg'>
      <div className='bg-white border shadow-lg rounded-xl h-[22rem]'>
        <div className="flex flex-col h-full">
          <div
            className={
              classNames(
                'flex justify-center items-center bg-white',
                'rounded-xl border-4 border-dial-blue-chalk',
                'py-12 mx-4 my-4 max-h-[10rem]'
              )}
          >
            {useCase.imageFile.indexOf('placeholder.svg') < 0 &&
              <div className="inline my-4 mx-6">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain max-h-[5rem] w-[5rem]"
                />
              </div>
            }
            {useCase.imageFile.indexOf('placeholder.svg') >= 0 &&
              <div className="w-20 h-20">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain"
                />
              </div>
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold line-clamp-1">
            {useCase.name}
          </div>
          <div className="px-6 py-2 text-xs text-dial-stratos font-medium">
            <span className="text-center line-clamp-3">
              {parse(useCase.sanitizedDescription)}
            </span>
          </div>
          {useCase.sector &&
            <div className="my-3 mx-auto text-xs font-medium">
              <div className="rounded-full bg-dial-blueberry uppercase shadow-none px-6 py-1 text-white">
                {useCase.sector?.name}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )

  return (
    <div className='relative'>
      <Link href={`/use-cases/${useCase.slug}`}>
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-blueberry' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default UseCaseCard
