import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useContext, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'

import { ORIGIN_ACRONYMS, ORIGIN_EXPANSIONS } from '../../lib/utilities'
import { ToastContext } from '../../lib/ToastContext'

const ellipsisTextStyle = `
  whitespace-nowrap overflow-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-product hover:text-dial-yellow
`

const ProductCard = ({ product, listType, filterDisplayed, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { showToast } = useContext(ToastContext)
  const navClickHandler = (target) => {
    showToast(`${format('app.openingDetails')} ...`, 'default', 'bottom-right', false)
  }

  const isEndorsingOrg = () => {
    if (!product.organizations) {
      return false
    }

    const endorserOrgs = product.organizations.filter((org) => {
      return org.isEndorser === true
    })

    return endorserOrgs.length > 0
  }

  const nameColSpan = () => {
    return !product.origins
      ? 'col-span-10'
      : filterDisplayed ? 'col-span-10 xl:col-span-4' : 'col-span-10 lg:col-span-4'
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
            <div onClick={() => navClickHandler()} className={containerElementStyle}>
              <div className='bg-white border border-dial-gray hover:border-transparent drop-shadow'>
                <div className='grid grid-cols-12 gap-x-4 py-4 px-4'>
                  <div className={`${nameColSpan()} font-semibold my-auto ${ellipsisTextStyle}`}>
                    <img
                      className='inline pr-3' width='50' height='50'
                      alt={format('image.alt.logoFor', { name: product.name })}
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                    />
                    {product.name}
                    <div
                      className={`
                        block ${filterDisplayed ? 'xl:hidden' : 'lg:hidden'}
                        font-normal mt-1 text-dial-purple ${ellipsisTextStyle}
                      `}
                    >
                      {product.origins && product.origins.length === 0 && format('general.na')}
                      {
                        product.origins && product.origins.length > 0 &&
                        product.origins
                          .map(origin => ORIGIN_EXPANSIONS[origin.name.toLowerCase()] || origin.name)
                          .join(', ')
                      }
                    </div>
                    <div className={`block ${filterDisplayed ? 'xl:hidden' : 'lg:hidden'} mt-1 text-sm xl:text-base font-semibold text-dial-cyan`}>
                      {product.productType === 'dataset' ? format('product.card.dataset').toUpperCase() : ''}
                    </div>
                  </div>
                  <div
                    className={`
                      hidden ${filterDisplayed ? 'xl:block' : 'lg:block'} col-span-2 font-semibold text-dial-cyan my-auto
                    `}
                  >
                    {product.productType === 'dataset' ? format('product.card.dataset').toUpperCase() : ''}
                  </div>
                  <div
                    className={`
                      hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                      md:col-span-4 text-base text-dial-purple ${ellipsisTextStyle}
                    `}
                  >
                    {product.origins && product.origins.length === 0 && format('general.na')}
                    {
                      product.origins && product.origins.length > 0 &&
                        product.origins
                          .map(origin => ORIGIN_EXPANSIONS[origin.name.toLowerCase()] || origin.name)
                          .join(', ')
                    }
                  </div>
                  <div
                    className={`
                      hidden ${filterDisplayed ? ' lg:block' : 'md:block'}
                      col-span-2 md:col-span-1 flex flex-row justify-end my-auto
                    `}
                  >
                    {
                      product.endorsers && product.endorsers.length > 0 &&
                        <img
                          alt={format('image.alt.logoFor', { name: format('endorsed.title') })}
                          data-tip={format('tooltip.endorsed')} className='mr-1.5 last:mr-0 h-5'
                          src='/icons/check/check.png'
                        />
                    }
                    {
                      isEndorsingOrg() &&
                        <img
                          alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                          data-tip={format('tooltip.digiprins')} className='mr-1.5 last:mr-0 h-5'
                          src='/icons/digiprins/digiprins.png'
                        />
                    }
                    {
                      product.tags && product.tags.indexOf(format('product.card.coronavirusTagValue').toLowerCase()) >= 0 &&
                        <img
                          alt={format('image.alt.logoFor', { name: format('coronavirus.title') })}
                          data-tip={format('tooltip.covid')} className='mr-1.5 last:mr-0 h-5'
                          src='/icons/coronavirus/coronavirus.png'
                        />
                    }
                    {product.isLaunchable && <img className='mr-1.5 last:mr-0 h-5' src='/icons/launchable/launchable.png' />}
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div onClick={() => navClickHandler()} className={containerElementStyle}>
              <div className='h-full flex flex-col border border-dial-gray hover:border-transparent drop-shadow'>
                <div className='flex flex-row p-1.5 border-b border-dial-gray product-card-header'>
                  {
                    product.endorsers && product.endorsers.length > 0 &&
                      <img
                        alt={format('image.alt.logoFor', { name: format('endorsed.title') })}
                        data-tip={format('tooltip.endorsed')} className='mr-1.5 last:mr-0 h-5'
                        src='/icons/check/check.png'
                      />
                  }
                  {
                    isEndorsingOrg() &&
                      <img
                        alt={format('image.alt.logoFor', { name: format('digitalPrinciple.title') })}
                        data-tip={format('tooltip.digiprins')} className='mr-1.5 last:mr-0 h-5'
                        src='/icons/digiprins/digiprins.png'
                      />
                  }
                  {
                    product.tags.indexOf(format('product.card.coronavirusTagValue').toLowerCase()) >= 0 &&
                      <img
                        alt={format('image.alt.logoFor', { name: format('coronavirus.title') })}
                        data-tip={format('tooltip.covid')} className='mr-1.5 last:mr-0 h-5'
                        src='/icons/coronavirus/coronavirus.png'
                      />
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
                  {
                    product.productDescription &&
                      <img
                        className='ml-auto opacity-20 hover:opacity-100 product-filter'
                        data-tip={product.productDescription.description}
                        data-html
                        alt='Info' height='20px' width='20px' src='/icons/info.svg'
                      />
                  }
                  <div className='m-auto'>
                    <img
                      className='w-40'
                      alt={format('image.alt.logoFor', { name: product.name })}
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + product.imageFile}
                    />
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                  <div className='pb-3 flex flex-row flex-wrap justify-between border-b border-dial-gray'>
                    <div className='pl-3 pt-3 flex flex-row flex-wrap'>
                      <div className='text-base my-auto mr-2'>{format('product.card.sdgs')}</div>
                      <div className='bg-white rounded p-1.5 flex flex-row'>
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
                              <img
                                data-tip={format('tooltip.forEntity', { entity: format('sdg.label'), name: sdg.name })}
                                key={`sdg-${sdg.slug}`} className='mr-1.5 last:mr-0 h-8 cursor-default'
                                alt={format('image.alt.logoFor', { name: sdg.name })}
                                src={`/images/sdgs/${sdg.slug}.png`}
                              />
                            ))
                        }
                        {
                          product.sustainableDevelopmentGoals.length > 2 &&
                            <span className='text-xl leading-none'>...</span>
                        }
                      </div>
                    </div>
                    <div className='px-3 pt-3 flex flex-row flex-wrap'>
                      <div className='text-base my-auto mr-2'>{format('product.card.buildingBlocks')}</div>
                      <div className='bg-white rounded p-1.5 flex flex-row'>
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
                              <img
                                data-tip={format('tooltip.forEntity', { entity: format('buildingBlock.label'), name: bb.name })}
                                key={`sdg-${bb.slug}`} className='mr-1 last:mr-0 w-8 building-block-filter cursor-default'
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
                        {(product.mainRepository?.license || format('general.na')).toUpperCase()}
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
