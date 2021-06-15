import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { ORIGIN_ACRONYMS, ORIGIN_EXPANSIONS } from '../../lib/utilities'

const ProductCard = ({ product, listType, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

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
            <div className='border-3 border-transparent hover:border-dial-yellow text-dial-purple hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-5 px-4'>
                  <div className='col-span-5 text-base font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden'>
                    {product.name}
                  </div>
                  <div className='col-span-2 pr-3 text-base text-dial-purple whitespace-nowrap overflow-ellipsis overflow-hidden'>
                    {product.productType === 'dataset' ? 'Dataset' : 'Product'}
                  </div>
                  <div className='col-span-4 pr-3 text-base text-dial-purple whitespace-nowrap overflow-ellipsis overflow-hidden'>
                    {
                      product.origins && product.origins.length === 0 && format('general.na')
                    }
                    {
                      product.origins && product.origins.length > 0 &&
                        product.origins
                          .map(origin => ORIGIN_EXPANSIONS[origin.name.toLowerCase()] || origin.name)
                          .join(', ')
                    }
                  </div>
                  <div className='col-span-1 flex flex-row justify-end'>
                    {
                      product.endorsers && product.endorsers.length > 0 &&
                        <img data-tip={format('tooltip.endorsed')} className='mr-1.5 last:mr-0 h-5' src='/icons/check/check.png' />
                    }
                    {
                      isEndorsingOrg() &&
                        <img data-tip={format('tooltip.digiprins')} className='mr-1.5 last:mr-0 h-5' src='/icons/digiprins/digiprins.png' />
                    }
                    {
                      product.tags && product.tags.indexOf(format('product.card.coronavirusTagValue').toLowerCase()) >= 0 &&
                        <img data-tip={format('tooltip.covid')} className='mr-1.5 last:mr-0 h-5' src='/icons/coronavirus/coronavirus.png' />
                    }
                    {product.isLaunchable && <img className='mr-1.5 last:mr-0 h-5' src='/icons/launchable/launchable.png' />}
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='border-3 border-transparent hover:border-dial-yellow text-dial-purple hover:text-dial-yellow cursor-pointer'>
              <div className='h-full flex flex-col justify-between border border-dial-gray hover:border-transparent shadow-lg hover:shadow-2xl'>
                <div className='flex flex-row p-1.5 border-b border-dial-gray product-card-header'>
                  {
                    product.endorsers && product.endorsers.length > 0 &&
                      <img data-tip={format('tooltip.endorsed')} className='mr-1.5 last:mr-0 h-5' src='/icons/check/check.png' />
                  }
                  {
                    isEndorsingOrg() &&
                      <img data-tip={format('tooltip.digiprins')} className='mr-1.5 last:mr-0 h-5' src='/icons/digiprins/digiprins.png' />
                  }
                  {
                    product.tags.indexOf(format('product.card.coronavirusTagValue').toLowerCase()) >= 0 &&
                      <img data-tip={format('tooltip.covid')} className='mr-1.5 last:mr-0 h-5' src='/icons/coronavirus/coronavirus.png' />
                  }
                  {product.isLaunchable && <img className='mr-1.5 last:mr-0 h-5' src='/icons/launchable/launchable.png' />}
                  {
                    product.productType === 'dataset' &&
                      <div className='ml-auto text-dial-cyan text-sm font-semibold'>
                        {format('product.card.dataset').toUpperCase()}
                      </div>
                  }
                </div>
                <div className='flex flex-col h-80 p-4'>
                  <div className='text-2xl font-semibold absolute w-64 2xl:w-80 bg-white bg-opacity-70'>
                    {product.name}
                  </div>
                  <img
                    className='ml-auto opacity-20 hover:opacity-100 product-filter'
                    data-tip={product.productDescriptions && product.productDescriptions[0] && product.productDescriptions[0].description}
                    data-html
                    alt='Info' height='20px' width='20px' src='/icons/info.svg'
                  />
                  <div className='m-auto align-middle w-40'>
                    <img
                      alt={format('image.alt.logoFor', { name: product.name })}
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                    />
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark '>
                  <div className='pb-3 flex flex-row flex-wrap justify-between border-b border-dial-gray'>
                    <div className='pl-3 pt-3 flex flex-row flex-wrap'>
                      <div className='text-base my-auto mr-2'>{format('product.card.sdgs')}</div>
                      <div className='bg-white rounded p-2 flex flex-row'>
                        {
                          product.sustainableDevelopmentGoals.length === 0 &&
                            <span className='text-base my-1 mx-auto font-semibold'>
                              {format('general.na')}
                            </span>
                        }
                        {
                          product.sustainableDevelopmentGoals
                            .filter((_, index) => index <= 2)
                            .map(sdg => (
                              <img
                                data-tip={format('tooltip.forEntity', { entity: format('sdg.label'), name: sdg.name })}
                                key={`sdg-${sdg.slug}`} className='mr-1.5 last:mr-0 h-8'
                                alt={format('image.alt.logoFor', { name: sdg.name })}
                                src={`/images/sdgs/${sdg.slug}.png`}
                              />
                            ))
                        }
                        {
                          product.sustainableDevelopmentGoals.length > 3 &&
                            <span className='text-xl leading-none'>...</span>
                        }
                      </div>
                    </div>
                    <div className='px-3 pt-3 flex flex-row flex-wrap'>
                      <div className='text-base my-auto mr-2'>{format('product.card.buildingBlocks')}</div>
                      <div className='bg-white rounded p-2 flex flex-row'>
                        {
                          product.buildingBlocks.length === 0 &&
                            <span className='text-base my-1 mx-auto font-semibold'>
                              {format('general.na')}
                            </span>
                        }
                        {
                          product.buildingBlocks
                            .filter((_, index) => index <= 2)
                            .map(bb => (
                              <img
                                data-tip={format('tooltip.forEntity', { entity: format('buildingBlock.label'), name: bb.name })}
                                key={`sdg-${bb.slug}`} className='mr-1.5 last:mr-0 h-8 building-block-filter'
                                alt={format('image.alt.logoFor', { name: bb.name })}
                                src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + bb.imageFile}
                              />
                            ))
                        }
                        {
                          product.buildingBlocks.length > 3 &&
                            <span className='text-xl leading-none'>...</span>
                        }
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row justify-between text-dial-gray-dark'>
                    <div className='pl-3 py-3 flex-auto flex flex-col'>
                      <div className='text-base my-auto'>{format('product.card.license')}</div>
                      <div className='bg-white mt-1.5 mr-auto p-2 rounded text-sm font-semibold'>
                        {(product.license || format('general.na')).toUpperCase()}
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
                            .map(origin => (
                              <div
                                key={`origin-${origin.slug}`} className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'
                                data-tip={format('tooltip.forEntity', { entity: format('origin.label'), name: ORIGIN_EXPANSIONS[origin.slug.toLowerCase()] })}
                              >
                                {(ORIGIN_ACRONYMS[origin.slug.toLowerCase()] || origin.slug).toUpperCase()}
                              </div>
                            ))
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
