import Link from 'next/link'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Building Blocks')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const BuildingBlockCard = ({ buildingBlock, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const createBuildingBlockBadge = (buildingBlock) =>
    buildingBlock.specUrl
      ? (
        <a href={buildingBlock.specUrl} target='_blank' rel='noreferrer'>
          <div className='flex gap-1'>
            <div className='text-dial-sapphire opacity-70 text-xs font-semibold'>
              {buildingBlock.maturity.toUpperCase()}
            </div>
            <div className='image-block-hack w-4'>
              <Image width={34} height={34} src='/assets/info.png' alt='Informational hint' />
            </div>
          </div>
        </a>
      )
      : (
        <div className='text-dial-stratos opacity-70 text-xs font-semibold'>
          {buildingBlock.maturity.toUpperCase()}
        </div>
      )

  const listDisplayType = () =>
    <div className={containerElementStyle}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
          <div className='w-10/12 lg:w-4/12 flex gap-2 my-auto text-dial-sapphire'>
            <div className='block w-6 h-6 relative opacity-60'>
              <Image
                fill
                className='object-contain'
                alt={format('image.alt.logoFor', { name: buildingBlock.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
              />
            </div>
            <div className='w-full font-semibold'>
              {buildingBlock.name}
            </div>
          </div>
          {
            buildingBlock.products &&
              <div className='w-8/12 lg:w-3/12 line-clamp-1'>
                {buildingBlock?.products?.length === 0 && format('general.na')}
                {
                  buildingBlock?.products?.length > 0 &&
                    buildingBlock.products.map(p => p.name).join(', ')
                }
              </div>
          }
          {
            buildingBlock.workflows &&
              <div className='w-8/12 lg:w-3/12 line-clamp-1'>
                {buildingBlock?.workflows?.length === 0 && format('general.na')}
                {
                  buildingBlock?.workflows?.length > 0 &&
                    buildingBlock.workflows.map(w => w.name).join(', ')
                }
              </div>
          }
          <div className='ml-auto font-semibold my-auto'>
            {buildingBlock.maturity && createBuildingBlockBadge(buildingBlock)}
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
          <div className='relative'>
            <div className='absolute top-2 left-2'>
              <div className='opacity-50 text-dial-stratos text-xs font-semibold'>
                {buildingBlock.category}
              </div>
            </div>
            <div className='absolute right-2 top-2'>
              {buildingBlock.maturity && createBuildingBlockBadge(buildingBlock)}
            </div>
          </div>
          <div className='flex text-dial-sapphire bg-dial-alice-blue h-24 rounded-t-lg'>
            <div className='px-4 text-sm text-center font-semibold m-auto'>
              {buildingBlock.name}
            </div>
          </div>
          <div className='my-8 mx-auto'>
            <div className='block w-24 h-16 relative opacity-60'>
              <Image
                fill
                className='object-contain'
                alt={format('image.alt.logoFor', { name: buildingBlock.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
              />
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {buildingBlock.products.length}
              </span>
              <span className='my-auto'>
                {buildingBlock.products.length > 1 ? format('product.header') : format('product.label')}
              </span>
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {buildingBlock.workflows.length}
              </span>
              <span className='my-auto'>
                {buildingBlock.workflows.length > 1 ? format('workflow.header') : format('workflow.label')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    !newTab
      ? <Link href={`/${collectionPath}/${buildingBlock.slug}`}>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </Link>
      : <a href={`/${collectionPath}/${buildingBlock.slug}`} target='_blank' rel='noreferrer' role='menuitem'>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </a>
  )
}

export default BuildingBlockCard
