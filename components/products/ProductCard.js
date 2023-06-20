import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames'
import { useIntl } from 'react-intl'
import { useCallback } from 'react'
import { ORIGIN_EXPANSIONS } from '../../lib/constants'

const containerElementStyle = classNames(
  'cursor-pointer hover:rounded-lg hover:shadow-lg',
  'border-3 border-transparent hover:border-dial-sunshine'
)

const ProductCard = ({ product, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const covidTagValue = format('product.card.coronavirusTagValue').toLowerCase()
  const createProductBadges = (product) =>
    <div className='relative'>
      <div className='absolute top-2 left-2'>
        <div className='flex gap-2'>
          {product.endorsers && product.endorsers.length > 0 &&
            <div className='w-4 my-auto image-block-hack'>
              <Image
                width={25}
                height={25}
                alt={format('image.alt.logoFor', { name: format('endorsed.title') })}
                data-tooltip-id='react-tooltip'
                data-tooltip-content={format('tooltip.endorsed')}
                src='/icons/check/check.png'
              />
            </div>
          }
          {product.tags.indexOf(covidTagValue) >= 0 &&
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
        product.productDescription &&
        <div className='absolute right-2 top-2'>
          <div className='image-block-hack w-4 opacity-20 hover:opacity-100'>
            <Image
              width={34}
              height={34}
              src='/assets/info.png'
              alt='Informational hint'
              data-tooltip-id='react-tooltip'
              data-tooltip-html={product.productDescription.description}
            />
          </div>
        </div>
      }
    </div>

  const listDisplayType = () =>
    <div className={`${containerElementStyle}`}>
      <div className='bg-white border border-dial-gray shadow-lg rounded-md'>
        <div className='relative flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4 py-4'>
          <div className='w-10/12 lg:w-4/12 flex text-dial-gray-dark my-auto'>
            <div className='block w-8 relative'>
              <Image
                fill
                className='object-contain'
                alt={format('image.alt.logoFor', { name: product.name })}
                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
              />
            </div>
            <div className='ml-2 mt-0.5 w-full h-3/5 font-semibold line-clamp-1'>
              {product.name}
            </div>
          </div>
          <div className='w-8/12 lg:w-4/12 text-sm lg:text-base my-auto text-dial-purple line-clamp-1'>
            {product.origins && product.origins.length === 0 && format('general.na')}
            {product.origins && product.origins.length > 0 &&
              product.origins
                .map(origin => ORIGIN_EXPANSIONS[origin.name.toLowerCase()] || origin.name)
                .join(', ')
            }
          </div>
          {product.commercialProduct !== undefined && (
            <div className='text-sm lg:text-base text-dial-purple my-auto line-clamp-1'>
              {product.commercialProduct
                ? format('product.pricing.commercial').toUpperCase()
                : product.mainRepository?.license?.toUpperCase() || format('general.na')
              }
            </div>
          )}
          <div className='absolute top-4 lg:top-1/3 right-4 lg:w-1/12 lg:justify-end'>
            <div className='flex gap-x-2'>
              {product?.endorsers?.length > 0 &&
                <img
                  alt={format('image.alt.logoFor', { name: format('endorsed.title') })}
                  data-tooltip-id='react-tooltip'
                  data-tooltip-content={format('tooltip.endorsed')}
                  className='h-5'
                  src='/icons/check/check.png'
                />
              }
              {product?.tags?.indexOf(covidTagValue) >= 0 &&
                <img
                  alt={format('image.alt.logoFor', { name: format('coronavirus.title') })}
                  data-tooltip-id='react-tooltip'
                  data-tooltip-content={format('tooltip.covid')}
                  className='h-5'
                  src='/icons/coronavirus/coronavirus.png'
                />
              }
            </div>
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
          {createProductBadges(product)}
          <div className='flex text-dial-sapphire bg-dial-alice-blue h-20 rounded-t-lg'>
            <div className='px-4 text-sm text-center font-semibold m-auto'>
              {product.name}
            </div>
          </div>
          <div className='mx-auto py-6'>
            <img
              className='object-contain h-20 w-20'
              layout='fill'
              alt={format('image.alt.logoFor', { name: product.name })}
              src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
            />
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {product.sustainableDevelopmentGoals.length}
              </span>
              <span className='my-auto'>
                {product.sustainableDevelopmentGoals.length > 1
                  ? format('sdg.shortHeader')
                  : format('sdg.shortLabel')
                }
              </span>
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-2 flex gap-2'>
              <span className='badge-avatar w-7 h-7'>
                {product.buildingBlocks.length}
              </span>
              <span className='my-auto'>
                {product.buildingBlocks.length > 1
                  ? format('building-block.header')
                  : format('building-block.label')
                }
              </span>
              {product.linkedWithDpi &&
                <div className='opacity-50 ml-auto my-auto'>
                  {format('buildingBlock.category.dpi')}
                </div>
              }
            </div>
          </div>
          <hr />
          <div className='text-xs text-dial-stratos font-semibold uppercase'>
            <div className='px-4 py-3 flex gap-2'>
              <span className='my-auto'>
                {product.commercialProduct
                  ? format('product.pricing.commercial').toUpperCase()
                  : product.mainRepository?.license?.toUpperCase() || format('general.na')
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  return (
    !newTab
      ? <Link href={`/products/${product.slug}`}>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </Link>
      : <a href={`/products/${product.slug}`} target='_blank' rel='noreferrer' role='menuitem'>
        { listType === 'list' ? listDisplayType() : cardDisplayType() }
      </a>
  )
}

export default ProductCard
