import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useCallback, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import Image from 'next/image'
import { ORIGIN_ACRONYMS, ORIGIN_EXPANSIONS } from '../../lib/utilities'

const ellipsisTextStyle = `
  whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-product hover:text-dial-yellow
`

const ProductCard = ({ product, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const isEndorsingOrg = () => {
    if (!product.organizations) {
      return false
    }

    const endorserOrgs = product.organizations.filter((org) => {
      return org.isEndorser === true
    })

    return endorserOrgs.length > 0
  }

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  return (
    <Link href={`/products/${product.slug}`}>
      <a {... newTab && { target: '_blank' }}>
        {
          listType === 'list'
            ? (
              <div className={`${containerElementStyle}`}>
                <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='relative flex flex-row flex-wrap gap-x-2 lg:gap-x-4 px-4' style={{ minHeight: '4.5rem' }}>
                    <div className='w-10/12 lg:w-4/12 text-base font-semibold text-dial-gray-dark my-auto relative'>
                      <Image
                        layout='fill'
                        objectFit='scale-down'
                        objectPosition='left'
                        sizes='1vw'
                        alt={format('image.alt.logoFor', { name: product.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                      />
                      <div className={`ml-8 w-4/5 h-3/5 font-semibold relative ${ellipsisTextStyle}`}>
                        {product.name}
                      </div>
                    </div>
                    <div className={`w-8/12 lg:w-4/12 text-sm lg:text-base text-dial-purple ${ellipsisTextStyle}`}>
                      {product.origins && product.origins.length === 0 && format('general.na')}
                      {
                        product.origins && product.origins.length > 0 &&
                        product.origins
                          .map(origin => ORIGIN_EXPANSIONS[origin.name.toLowerCase()] || origin.name)
                          .join(', ')
                      }
                    </div>
                    <div className='absolute top-4 lg:top-1/3 right-4 flex gap-x-1.5 lg:w-1/12 lg:justify-end'>
                      {
                        product.endorsers && product.endorsers.length > 0 &&
                          <img
                            alt={format('image.alt.logoFor', { name: format('endorsed.title') })}
                            data-tip={format('tooltip.endorsed')} className='h-5' src='/icons/check/check.png'
                          />
                      }
                      {
                        isEndorsingOrg() &&
                          <img
                            alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                            data-tip={format('tooltip.digiprins')} className='h-5' src='/icons/digiprins/digiprins.png'
                          />
                      }
                      {
                        product.tags && product.tags.indexOf(format('product.card.coronavirusTagValue').toLowerCase()) >= 0 &&
                          <img
                            alt={format('image.alt.logoFor', { name: format('coronavirus.title') })}
                            data-tip={format('tooltip.covid')} className='h-5' src='/icons/coronavirus/coronavirus.png'
                          />
                      }
                      {product.isLaunchable &&
                        <img
                          data-tip={format('tooltip.launchable')} className='h-5' src='/icons/launchable/launchable.png'
                          alt={format('image.alt.logoFor', { name: format('product.launchable') })}
                        />}
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
              <div className={containerElementStyle}>
                <div className='h-full flex flex-col border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='flex flex-row gap-x-1.5 p-1.5 border-b border-dial-gray product-card-header'>
                    {
                      product.endorsers && product.endorsers.length > 0 &&
                        <img
                          alt={format('image.alt.logoFor', { name: format('endorsed.title') })}
                          data-tip={format('tooltip.endorsed')} className='h-5' src='/icons/check/check.png'
                        />
                    }
                    {
                      isEndorsingOrg() &&
                        <img
                          alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                          data-tip={format('tooltip.digiprins')} className='h-5' src='/icons/digiprins/digiprins.png'
                        />
                    }
                    {
                      product.tags.indexOf(format('product.card.coronavirusTagValue').toLowerCase()) >= 0 &&
                        <img
                          alt={format('image.alt.logoFor', { name: format('coronavirus.title') })}
                          data-tip={format('tooltip.covid')} className='h-5' src='/icons/coronavirus/coronavirus.png'
                        />
                    }
                    {
                      product.isLaunchable &&
                        <img
                          alt={format('image.alt.logoFor', { name: format('product.launchable') })}
                          data-tip={format('tooltip.launchable')} className='h-5' src='/icons/launchable/launchable.png'
                        />
                    }
                  </div>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-64 2xl:w-80'>
                      {product.name}
                    </div>
                    {
                      product.productDescription &&
                        <img
                          className='ml-auto opacity-20 hover:opacity-100 product-filter'
                          data-tip={product.productDescription.description}
                          data-html
                          alt='Info' height='20px' width='20px' src='/icons/info.svg'
                        />
                    }
                    <div className='m-auto w-3/5 h-3/5 relative'>
                      <Image
                        layout='fill'
                        objectFit='contain'
                        className='w-40'
                        alt={format('image.alt.logoFor', { name: product.name })}
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='pb-3 flex flex-row flex-wrap justify-between border-b border-dial-gray'>
                      <div className='pl-3 pt-3 flex flex-row'>
                        <div className='text-base my-auto mr-1'>{format('product.card.sdgs')}</div>
                        <div className='bg-white rounded p-1.5 flex flex-row gap-x-1'>
                          {
                            product.sustainableDevelopmentGoals.length === 0 &&
                              <span className='text-base my-1 mx-auto font-semibold'>
                                {format('general.na')}
                              </span>
                          }
                          {
                            product.sustainableDevelopmentGoals
                              .filter((_, index) => index <= 1)
                              .map(sdg => (
                                <Image
                                  height={30} width={30}
                                  data-tip={format('tooltip.forEntity', { entity: format('sdg.label'), name: sdg.name })}
                                  key={`sdg-${sdg.slug}`} className='h-8 cursor-default'
                                  alt={format('image.alt.logoFor', { name: sdg.name })}
                                  src={`/images/sdgs/${sdg.slug}.png`}
                                />
                              ))
                          }
                          {
                            product.sustainableDevelopmentGoals.length > 2 &&
                              <span className='text-base'>...</span>
                          }
                        </div>
                      </div>
                      <div className='px-3 pt-3 flex flex-row flex-wrap'>
                        <div className='text-base my-auto mr-1'>{format('product.card.buildingBlocks')}</div>
                        <div className='bg-white rounded p-1.5 flex flex-row gap-x-1'>
                          {
                            product.buildingBlocks.length === 0 &&
                              <span className='text-base my-1 mx-auto font-semibold'>
                                {format('general.na')}
                              </span>
                          }
                          {
                            product.buildingBlocks
                              .filter((_, index) => index <= 1)
                              .map(bb => (
                                <Image
                                  height={30} width={30}
                                  data-tip={format('tooltip.forEntity', { entity: format('buildingBlock.label'), name: bb.name })}
                                  key={`sdg-${bb.slug}`} className='w-8 building-block-filter cursor-default'
                                  alt={format('image.alt.logoFor', { name: bb.name })}
                                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + bb.imageFile}
                                />
                              ))
                          }
                          {
                            product.buildingBlocks.length > 2 &&
                              <span className='text-xl leading-none'>...</span>
                          }
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-row justify-between text-dial-gray-dark'>
                      <div className='pl-3 py-3 flex-auto flex flex-col'>
                        <div className='text-base my-auto'>{format('product.card.license')}</div>
                        <div className='bg-white mt-1.5 mr-auto p-2 rounded text-sm font-semibold'>
                          {
                            product.commercialProduct
                              ? format('product.pricing.commercial').toUpperCase()
                              : (product.mainRepository?.license || format('general.na')).toUpperCase()
                          }
                        </div>
                      </div>
                      {
                        product.maturityScore &&
                          <div className='pl-3 py-3 flex-auto flex flex-col'>
                            <div className='text-base m-auto'>
                              {format('product.card.maturityScore')}
                            </div>
                            <div className='bg-dial-cyan mt-1.5 mx-auto px-3 py-2 rounded text-sm text-white'>
                              {product.maturityScore || format('general.na')}
                            </div>
                          </div>
                      }
                      <div className='pr-3 py-3 flex-auto flex flex-col'>
                        <div className='text-base text-right my-auto'>Sources</div>
                        <div className='flex flex-row justify-end font-semibold'>
                          {
                            product.origins.length === 0 &&
                              <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'>
                                {format('general.na')}
                              </div>
                          }
                          {
                            product.origins
                              .filter((_, index) => index <= 2)
                              .map(origin => {
                                const nominee = origin.slug === 'dpga' && product.endorsers.length === 0 ? ' ' + format('product.nominee') : ''
                                const toolTip = (product.endorsers && product.endorsers.filter(endorser => endorser.slug === origin.slug).length > 0)
                                  ? format('product.endorsed-by') + origin.name
                                  : format('tooltip.forEntity', {
                                    entity: format('origin.label'),
                                    name: ORIGIN_EXPANSIONS[origin.slug.toLowerCase()]
                                  }) + nominee

                                return (
                                  <div
                                    key={`origin-${origin.slug}`} className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'
                                    data-tip={toolTip}
                                  >
                                    {(ORIGIN_ACRONYMS[origin.slug.toLowerCase()] || origin.slug).toUpperCase()}
                                  </div>
                                )
                              })
                          }
                          {
                            product.origins.length > 3 &&
                              <div
                                className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'
                                data-tip={format('tooltip.ellipsisFor', { entity: format('product.label') })}
                              >
                                &hellip;
                              </div>
                          }
                        </div>
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

export default ProductCard
