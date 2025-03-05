import { useCallback } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { CategoryType, DisplayType, MaturityStatus } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const BuildingBlockCard = ({ disabled, displayType, index, buildingBlock, dismissHandler }) => {
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
              {buildingBlock.govStackEntity &&
                <div className='border border-dial-iris-blue text-dial-iris-blue rounded px-6 py-1'>
                  {format('govstack.label').toUpperCase()}
                </div>
              }
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

  const displayGridCard = () => (
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg'>
      <div className='bg-white border shadow-lg rounded-xl h-[22rem]'>
        <div className="flex flex-col h-full">
          <div
            className={
              classNames(
                'flex justify-center items-center bg-white',
                'rounded-xl border-4 border-dial-warm-beech',
                'py-12 mx-4 my-4 max-h-[10rem]'
              )}
          >
            {buildingBlock.imageFile.indexOf('placeholder.svg') < 0 &&
              <div className="inline my-4 mx-6">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain max-h-[5rem] w-[5rem]"
                />
              </div>
            }
            {buildingBlock.imageFile.indexOf('placeholder.svg') >= 0 &&
              <div className="w-20 h-20">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain"
                />
              </div>
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold line-clamp-1">
            {buildingBlock.name}
          </div>
          <div className="px-6 py-2 text-xs text-dial-stratos font-medium">
            <span className="text-center line-clamp-3">
              {parse(buildingBlock.parsedDescription)}
            </span>
          </div>
          {buildingBlock.category &&
            <div className="my-3 mx-auto text-xs font-medium">
              <div className="rounded-full bg-dial-orange uppercase shadow-none px-6 py-1 text-white">
                {buildingBlock.category}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )

  return (
    <div className='relative'>
      <Link
        href={`/building-blocks/${buildingBlock.slug}`}
        onClick={(e) => { if (disabled) e.preventDefault() }}
      >
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
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
