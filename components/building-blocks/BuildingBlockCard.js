import Link from 'next/link'
import { createRef, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import Image from 'next/image'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Building Blocks')

const ellipsisTextStyle = `
   whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-building-block hover:text-dial-yellow
`

const BuildingBlockCard = ({ buildingBlock, listType, filterDisplayed, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const productContainer = createRef()
  const [productOverflow, setProductOverflow] = useState(false)

  const workflowContainer = createRef()
  const [workflowOverflow, setWorkflowOverflow] = useState(false)

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    const wc = workflowContainer.current
    if (wc) {
      const workflowOverflow = wc.offsetHeight < wc.scrollHeight || wc.offsetWidth < wc.scrollWidth
      setWorkflowOverflow(workflowOverflow)
    }

    const pc = productContainer.current
    if (pc) {
      const productOverflow = pc.offsetHeight < pc.scrollHeight || pc.offsetWidth < pc.scrollWidth
      setProductOverflow(productOverflow)
    }
  }, [workflowOverflow, productOverflow])

  const nameColSpan = (buildingBlock) => {
    return !buildingBlock.products && !buildingBlock.workflows
      ? 'col-span-10'
      : filterDisplayed ? 'col-span-10 xl:col-span-4' : 'col-span-10 lg:col-span-4'
  }

  const maturityColSpan = (buildingBlock) => {
    return !buildingBlock.products && !buildingBlock.workflows
      ? 'col-span-2'
      : filterDisplayed ? 'col-span-2 xl:col-span-1' : 'col-span-2 lg:col-span-1'
  }

  const navClickHandler = () => {
  }

  return (
    <Link href={`/${collectionPath}/${buildingBlock.slug}`}>
      <a {... newTab && { target: '_blank' }}>
        {
          listType === 'list'
            ? (
              <div onClick={() => navClickHandler()} className={containerElementStyle}>
                <div className='bg-white border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='grid grid-cols-12 gap-x-4 py-4 px-4'>
                    <div className={`${nameColSpan(buildingBlock)} pr-3 text-base font-semibold ${ellipsisTextStyle}`}>
                      {
                        buildingBlock.imageFile &&
                          <Image
                            alt={format('image.alt.logoFor', { name: buildingBlock.name })} className='building-block-filter inline mr-2 '
                            src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                            height='20' width='20'
                          />
                      }
                      <span className={`ml-8 w-4/5 h-3/5 relative ${ellipsisTextStyle}`} >
                        {buildingBlock.name}
                      </span>
                      {
                        buildingBlock.products &&
                          <div className={`${filterDisplayed ? ' xl:hidden' : 'lg:hidden'} flex flex-row mt-1 text-product`}>
                            <div className='text-sm font-normal'>
                              {format('product.header')}:
                            </div>
                            <div className='mx-1 text-sm font-normal overflow-hidden text-ellipsis'>
                              {buildingBlock.products.length === 0 && format('general.na')}
                              {
                                buildingBlock.products.length > 0 &&
                                  buildingBlock.products.map(p => p.name).join(', ')
                              }
                            </div>
                          </div>
                      }
                      {
                        buildingBlock.workflows &&
                          <div className={`${filterDisplayed ? 'xl:hidden' : 'lg:hidden'} flex flex-row mt-1 text-workflow`}>
                            <div className='text-sm font-normal'>
                              {format('workflow.header')}:
                            </div>
                            <div className='mx-1 text-sm font-normal overflow-hidden text-ellipsis'>
                              {buildingBlock.workflows.length === 0 && format('general.na')}
                              {
                                buildingBlock.workflows.length > 0 &&
                                  buildingBlock.workflows.map(w => w.name).join(', ')
                              }
                            </div>
                          </div>
                      }
                    </div>
                    {
                      buildingBlock.products &&
                        <div
                          className={`
                            hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                            col-span-3 pr-3 text-base text-product ${ellipsisTextStyle}
                          `}
                        >
                          {buildingBlock.products.length === 0 && format('general.na')}
                          {
                            buildingBlock.products.length > 0 &&
                              buildingBlock.products.map(p => p.name).join(', ')
                          }
                        </div>
                    }
                    {
                      buildingBlock.workflows &&
                        <div
                          className={`
                            hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                            col-span-4 text-base text-workflow ${ellipsisTextStyle}
                          `}
                        >
                          {buildingBlock.workflows && buildingBlock.workflows.length === 0 && format('general.na')}
                          {
                            buildingBlock.workflows && buildingBlock.workflows.length > 0 &&
                              buildingBlock.workflows.map(w => w.name).join(', ')
                          }
                        </div>
                    }
                    <div className={`${maturityColSpan(buildingBlock)} flex flex-row font-semibold opacity-50 justify-end`}>
                      {buildingBlock.maturity}
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
              <div
                onClick={() => navClickHandler()}
                className={`
                  border-3 border-transparent hover:border-dial-yellow
                  text-building-block hover:text-dial-yellow cursor-pointer
                `}
              >
                <div className='h-full flex flex-col border border-dial-gray hover:border-transparent card-drop-shadow'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray'>
                    <div className='ml-auto text-button-gray-light text-sm font-semibold'>
                      { buildingBlock.specUrl ? (
                        <a href={buildingBlock.specUrl} className='text-dial-blue' target='_blank' rel='noreferrer'>
                          <div className='text-dial-blue'>{buildingBlock.maturity.toUpperCase()}</div>
                        </a>
                      ) : (
                        buildingBlock.maturity.toUpperCase()
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-64 2xl:w-80'>
                      {buildingBlock.name}
                    </div>
                    <div className='m-auto w-3/5 h-3/5 relative' >
                      <Image
                        layout='fill'
                        objectFit='contain'
                        alt={format('image.alt.logoFor', { name: buildingBlock.name })} className='building-block-filter'
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                      />
                    </div>
                  </div>
                  <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark mt-auto'>
                    <div className='flex flex-row border-b border-dial-gray'>
                      <div className='pl-3 py-3 text-dial-teal-light flex flex-row'>
                        <div className='text-base my-auto mr-2'>{format('workflow.header')}</div>
                        <div className='flex flex-row'>
                          <div
                            className='pl-3 flex flex-row flex-wrap font-semibold overflow-hidden'
                            style={{ maxHeight: '40px' }}
                            ref={workflowContainer}
                          >
                            {
                              buildingBlock.workflows.length === 0 &&
                                <span className='text-base my-1 mx-auto font-semibold'>
                                  {format('general.na')}
                                </span>
                            }
                            {
                              buildingBlock.workflows
                                .map(workflow => (
                                  <div key={`workflow-${workflow.slug}`} className='bg-white p-2 mr-1.5 cursor-default'>
                                    <Image
                                      width={20} height={20}
                                      className='m-auto h-6 workflow-filter'
                                      data-tip={format('tooltip.forEntity', { entity: format('workflow.label'), name: workflow.name })}
                                      alt={format('image.alt.logoFor', { name: workflow.name })}
                                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
                                    />
                                  </div>
                                ))
                            }
                          </div>
                          {
                            workflowOverflow && (
                              <div className='bg-white mr-3 px-2 rounded text-sm'>
                                <span
                                  className='text-xl bg-white leading-normal'
                                  data-tip={format('tooltip.ellipsisFor', { entity: format('buildingBlock.label') })}
                                >
                                  &hellip;
                                </span>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-row text-dial-gray-dark'>
                      <div className='py-3 text-dial-gray-dark flex-col flex'>
                        <div className='pl-3 text-base my-auto'>{format('products.header')}</div>
                        <div className='flex flex-row'>
                          <div
                            className='pl-3 pr-1.5 flex flex-row flex-wrap font-semibold overflow-hidden'
                            style={{ maxHeight: '46px' }}
                            ref={productContainer}
                          >
                            {
                              buildingBlock.products.length === 0 &&
                                <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded'>
                                  {format('general.na')}
                                </div>
                            }
                            {
                              buildingBlock.products
                                .map(product => (
                                  <div
                                    key={`product-${product.slug}`}
                                    className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded cursor-default'
                                    data-tip={format('tooltip.forEntity', { entity: format('product.label'), name: product.name })}
                                  >
                                    {product.name}
                                  </div>
                                ))
                            }
                          </div>
                          {
                            productOverflow &&
                              <div className='bg-white mt-1.5 mr-3 px-2 rounded'>
                                <span
                                  className='text-xl bg-white leading-normal'
                                  data-tip={format('tooltip.ellipsisFor', { entity: format('buildingBlock.label') })}
                                >
                                  &hellip;
                                </span>
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

export default BuildingBlockCard
