import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import classNames from 'classnames'
import parse from 'html-react-parser'
import { FaXmark } from 'react-icons/fa6'
import { CategoryType, DisplayType, MaturityStatus } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const BuildingBlockCard = ({ displayType, index, disabled, buildingBlock, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`${disabled && 'opacity-20'}`}>
      <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-warm-beech'}`}>
        <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
          {buildingBlock.imageFile.indexOf('placeholder.svg') < 0 &&
            <div className='w-16 h-16 mx-auto px-1 py-1 rounded-full bg-dial-orange'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
                className='object-contain w-10 h-10 mx-auto my-2 white-filter'
              />
            </div>
          }
          {buildingBlock.imageFile.indexOf('placeholder.svg') >= 0 &&
            <div className='w-16 h-16 mx-auto'>
              <img
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.label') })}
                className='object-contain'
              />
            </div>
          }
          <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
            <div className='text-lg font-semibold text-dial-ochre'>
              {buildingBlock.name}
            </div>
            <div className='line-clamp-4 max-w-3xl'>
              {buildingBlock?.parsedDescription && parse(buildingBlock?.parsedDescription)}
            </div>
            <div className='flex gap-x-2 text-dial-stratos'>
              <div className='text-sm'>
                {format('ui.workflow.header')} ({buildingBlock.workflows?.length ?? 0})
              </div>
              <div className='border border-r border-dial-slate-300' />
              <div className='text-sm'>
                {format('ui.product.header')} ({buildingBlock.products?.length ?? 0})
              </div>
            </div>
            <div className='flex gap-2 text-xs text-white'>
              <div
                className={classNames(
                  'px-6 py-1 rounded',
                  buildingBlock.maturity === MaturityStatus.DRAFT
                    ? 'border border-dial-orange text-dial-orange'
                    : 'bg-dial-orange'
                )}
              >
                {buildingBlock.maturity}
              </div>
              {buildingBlock.category === CategoryType.DPI &&
                <div className='bg-dial-orange rounded px-6 py-1'>
                  {buildingBlock.category}
                </div>
              }
              {buildingBlock.govStackEntity &&
                <div className='bg-dial-iris-blue rounded px-6 py-1'>
                  {format('govstack.label')}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className={`${disabled && 'opacity-20'}`}>
      <div className='rounded-lg bg-gradient-to-r from-building-block-bg-light to-building-block-bg'>
        <div className='flex flex-row gap-x-3 px-6 py-3'>
          <div className='rounded-full bg-dial-orange w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.buildingBlock.header') })}
              className={classNames(
                'object-contain w-6 h-6 my-2 mx-auto',
                buildingBlock.imageFile.indexOf('placeholder.svg') <= 0 ? 'w-6 h-6 my-2 white-filter' : ''
              )}
            />
          </div>
          <div className='flex flex-col gap-y-1'>
            <div className='text-sm font-semibold my-auto text-dial-ochre line-clamp-1'>
              {buildingBlock.name}
            </div>
            <div className='flex gap-2 text-xs text-white'>
              <div
                className={classNames(
                  'px-6 py-1 rounded',
                  buildingBlock.maturity === MaturityStatus.DRAFT
                    ? 'border border-dial-orange text-dial-orange'
                    : 'bg-dial-orange'
                )}
              >
                {buildingBlock.maturity}
              </div>
              {buildingBlock.category === CategoryType.DPI &&
                <div className='bg-dial-orange rounded px-6 py-1'>
                  {buildingBlock.category}
                </div>
              }
              {buildingBlock.govStackEntity &&
                <div className='bg-dial-iris-blue rounded px-6 py-1'>
                  {format('govstack.label')}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    <div className='relative'>
      <Link href={`/building-blocks/${buildingBlock.slug}`}>
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-ochre' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default BuildingBlockCard
