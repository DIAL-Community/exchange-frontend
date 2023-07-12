import Link from 'next/link'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import Image from 'next/image'
import { ORIGIN_EXPANSIONS } from '../../lib/constants'

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const DatasetCard = ({ dataset, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const covidTagValue = format('product.card.coronavirusTagValue')
  const createDatasetBadges = (dataset) =>
    <div className='relative'>
      <div className='absolute top-2 left-2'>
        <div className='flex gap-2'>
          {dataset.tags.indexOf(covidTagValue) >= 0 &&
            <div className='w-4 my-auto image-block-hack'>
              <Image
                width={25}
                height={25}
                alt={format('image.alt.logoFor', { name: format('coronavirus.title') })}
                data-tooltip-id='react-tooltip'
                data-tooltip-content={format('tooltip.covid')}
                src='/icons/coronavirus/coronavirus.png'
              />
            </div>
          }
        </div>
      </div>
      {// Placing the information icon on the top right of the image and name.
        dataset.datasetType &&
        <div className='absolute right-2 top-2'>
          <div className='text-dial-gray-dark text-xs font-semibold'>
            {dataset.datasetType.toUpperCase()}
          </div>
        </div>
      }
    </div>

  const listDisplayType = () =>
    <div className={containerElementStyle}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
          <div className='w-10/12 lg:w-4/12 flex gap-2 my-auto text-dial-sapphire'>
            <div className='block w-6 h-6 relative'>
              <Image
                fill
                className='object-contain'
                alt={format('image.alt.logoFor', { name: dataset.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
              />
            </div>
            <div className='w-full font-semibold line-clamp-1'>
              {dataset.name}
            </div>
          </div>
          <div className='w-8/12 lg:w-6/12 line-clamp-1'>
            {dataset?.origins?.length === 0 && format('general.na')}
            {
              dataset?.origins?.length > 0 &&
              dataset.origins
                .map(origin => ORIGIN_EXPANSIONS[origin.name.toLowerCase()] || origin.name)
                .join(', ')
            }
          </div>
          <div className='ml-auto font-semibold my-auto text-dial-cyan'>
            {dataset.datasetType}
          </div>
        </div>
      </div>
    </div>

  const cardDisplayType = () =>
    <div className={containerElementStyle}>
      <div
        className={classNames(
          'bg-white shadow-lg rounded-lg h-full',
          'border border-dial-gray hover:border-transparent'
        )}
      >
        <div className='flex flex-col'>
          {createDatasetBadges(dataset)}
          <div className='flex text-dial-sapphire bg-dial-alice-blue h-20 rounded-t-lg'>
            <div className='px-4 text-sm text-center font-semibold m-auto'>
              {dataset.name}
            </div>
          </div>
          <div className='mx-auto py-6'>
            <img
              className='object-contain h-20 w-20'
              layout='fill'
              alt={format('image.alt.logoFor', { name: dataset.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + dataset.imageFile}
            />
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {dataset.sustainableDevelopmentGoals.length}
              </span>
              <span className='my-auto'>
                {dataset.sustainableDevelopmentGoals.length > 1
                  ? format('sdg.shortHeader')
                  : format('sdg.shortLabel')
                }
              </span>
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-3 flex gap-2'>
              <span className='my-auto'>
                {(dataset.license || format('general.na')).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    !newTab
      ? <Link href={`/datasets/${dataset.slug}`}>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </Link>
      : <a href={`/datasets/${dataset.slug}`} target='_blank' rel='noreferrer' role='menuitem'>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </a>
  )
}

export default DatasetCard
