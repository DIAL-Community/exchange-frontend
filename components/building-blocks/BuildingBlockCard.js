import Link from 'next/link'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Building Blocks')

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-yellow'
)

const BuildingBlockCard = ({ buildingBlock, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const createBuildingBlockBadge = (buildingBlock) =>
    buildingBlock.specUrl
      ? (
        <a href={buildingBlock.specUrl} target='_blank' rel='noreferrer'>
          <div className='flex gap-1'>
            <div className='text-dial-sapphire text-xs font-semibold'>
              {buildingBlock.maturity.toUpperCase()}
            </div>
            <div className='image-block-hack w-4'>
              <Image width={34} height={34} src='/assets/info.png' alt='Informational hint' />
            </div>
          </div>
        </a>
      )
      : (
        <div className='text-dial-gray-dark text-xs font-semibold'>
          {buildingBlock.maturity.toUpperCase()}
        </div>
      )

  return (
    <Link href={`/${collectionPath}/${buildingBlock.slug}`}>
      <a {... newTab && { target: '_blank' }}>
        {
          listType === 'list'
            ? (
              <div className={containerElementStyle}>
                <div className='bg-white border border-dial-gray hover:border-transparent shadow-lg'>
                  <div className='relative flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-6'>
                    <div className='w-10/12 lg:w-4/12 flex gap-2 my-auto text-dial-sapphire'>
                      <div className='block w-8 relative'>
                        <Image
                          layout='fill'
                          objectFit='scale-down'
                          objectPosition='left'
                          alt={format('image.alt.logoFor', { name: buildingBlock.name })}
                          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                        />
                      </div>
                      <div className='w-full font-semibold line-clamp-1'>
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
            )
            : (
              <div className={containerElementStyle}>
                <div
                  className={classNames(
                    'bg-white shadow-lg rounded-lg h-full',
                    'border border-dial-gray hover:border-transparent'
                  )}
                >
                  <div className='flex flex-col'>
                    <div className='relative'>
                      <div className='absolute right-2 top-2'>
                        {buildingBlock.maturity && createBuildingBlockBadge(buildingBlock)}
                      </div>
                    </div>
                    <div className='flex bg-dial-alice-blue h-24 rounded-t-lg'>
                      <div className='px-4 font-semibold text-dial-sapphire m-auto line-clamp-1'>
                        {buildingBlock.name}
                      </div>
                    </div>
                    <div className='mx-auto py-6'>
                      <img
                        className='object-contain h-20 w-20'
                        layout='fill'
                        alt={format('image.alt.logoFor', { name: buildingBlock.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                      />
                    </div>
                    <hr />
                    <div className='text-xs text-dial-stratos font-semibold uppercase'>
                      <div className='px-4 py-2 flex gap-2'>
                        <span className='badge-avatar w-7 h-7'>
                          {buildingBlock.products.length}
                        </span>
                        <span className='my-auto'>
                          {format('product.header')}
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
                          {format('workflow.header')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        }
      </a>
    </Link>
  )
}

export default BuildingBlockCard
