import { useCallback } from 'react'
import classNames from 'classnames'
import parse from 'html-react-parser'
import Link from 'next/link'
import { FaXmark } from 'react-icons/fa6'
import { useIntl } from 'react-intl'
import { DisplayType } from '../utils/constants'
import { isValidFn } from '../utils/utilities'

const DatasetCard = ({ displayType, index, dataset, dismissHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const displayLargeCard = () =>
    <div className={`px-4 py-6 rounded-lg min-h-[13.5rem] ${index % 2 === 0 && 'bg-dial-violet'}`}>
      <div className='flex flex-col lg:flex-row gap-x-6 gap-y-3'>
        {dataset.imageFile.indexOf('placeholder.svg') < 0 &&
          <div className='w-16 h-16 mx-auto bg-white border'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.dataset.label') })}
              className='object-contain w-10 h-10 mx-auto my-2'
            />
          </div>
        }
        {dataset.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='w-16 h-16 mx-auto bg-dial-plum rounded-full'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.dataset.label') })}
              className='object-contain w-10 h-10 white-filter mt-3 mx-auto'
            />
          </div>
        }
        <div className='flex flex-col gap-y-3 max-w-3xl lg:w-10/12'>
          <div className='text-lg font-semibold text-dial-plum'>
            {dataset.name}
          </div>
          <div className='line-clamp-4 text-dial-stratos'>
            {dataset?.datasetDescription && parse(dataset?.parsedDescription)}
          </div>
          <div className='flex gap-x-2 text-dial-stratos'>
            <div className='text-sm'>
              {format('ui.sdg.header')} ({dataset.sdgs?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.sector.header')} ({dataset.sectors?.length ?? 0})
            </div>
            <div className='border-r border-dial-slate-400' />
            <div className='text-sm'>
              {format('ui.tag.header')} ({dataset.tags?.length ?? 0})
            </div>
          </div>
        </div>
      </div>
    </div>

  const displaySmallCard = () =>
    <div className='rounded-lg bg-gradient-to-r from-dataset-bg-light to-dataset-bg h-16'>
      <div className='flex flex-row gap-x-3 px-6 h-full'>
        {dataset.imageFile.indexOf('placeholder.svg') >= 0 &&
          <div className='rounded-full my-auto w-10 h-10 min-w-[2.5rem]'>
            <img
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
              alt={format('ui.image.logoAlt', { name: format('ui.dataset.header') })}
              className='object-contain w-10 h-10 my-auto'
            />
          </div>
        }
        {dataset.imageFile.indexOf('placeholder.svg') < 0 &&
          <img
            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
            alt={format('ui.image.logoAlt', { name: format('ui.dataset.header') })}
            className='object-contain w-10 h-10 my-auto min-w-[2.5rem]'
          />
        }
        <div className='text-sm font-semibold text-dial-plum my-auto'>
          {dataset.name}
        </div>
      </div>
    </div>

  const displayGridCard = () => (
    <div className='cursor-pointer hover:rounded-lg hover:shadow-lg'>
      <div className='bg-white shadow-lg rounded-xl h-[360px]'>
        <div className="flex flex-col h-full">
          <div
            className={
              classNames(
                'flex justify-center items-center bg-white',
                'rounded-xl border-4 border-dial-warm-beech',
                'py-12 mx-4 my-4 max-h-[180px]'
              )}
          >
            {dataset.imageFile.indexOf('placeholder.svg') < 0 &&
              <div className="inline my-4 mx-6">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className="object-contain max-h-[80px]" width="80px"
                />
              </div>
            }
            {dataset.imageFile.indexOf('placeholder.svg') >= 0 &&
              <div className="w-20 h-20 flex justify-center items-center">
                <img
                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
                  alt={format('ui.image.logoAlt', { name: format('ui.product.label') })}
                  className='object-contain w-10 h-10 mx-auto'
                />
              </div>
            }
          </div>
          <div className="px-6 text-xl text-center font-semibold line-clamp-1">
            {dataset.name}
          </div>
          <div className="px-6 py-2 text-xs text-dial-stratos font-medium">
            <span className="text-center line-clamp-3">
              {dataset?.datasetDescription && parse(dataset?.parsedDescription)}
            </span>
          </div>
          <div className="my-3 mx-auto text-xs font-medium">
            <div className="rounded-full bg-dial-orange uppercase shadow-none px-6 py-1 text-white">
              {dataset?.datasetType}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='relative'>
      <Link href={`/datasets/${dataset.slug}`}>
        {displayType === DisplayType.GRID_CARD && displayGridCard()}
        {displayType === DisplayType.LARGE_CARD && displayLargeCard()}
        {displayType === DisplayType.SMALL_CARD && displaySmallCard()}
      </Link>
      { isValidFn(dismissHandler) &&
        <button type='button' className='absolute top-2 right-2'>
          <FaXmark size='1rem' className='text-dial-plum' onClick={dismissHandler} />
        </button>
      }
    </div>
  )
}

export default DatasetCard
