import Link from 'next/link'
import { createRef, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'

import { convertToKey } from '../context/FilterResultContext'
const collectionPath = convertToKey('Building Blocks')

const BuildingBlockCard = ({ buildingBlock, listType, newTab = false }) => {
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
      : 'col-span-4'
  }

  const maturityColSpan = (buildingBlock) => {
    return !buildingBlock.products && !buildingBlock.workflows
      ? 'col-span-2'
      : 'col-span-1'
  }

  return (
    <Link href={`/${collectionPath}/${buildingBlock.slug}`}>
      <a { ... newTab && {target: '_blank'}}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-building-block hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-4 px-4'>
                  <div className={`${nameColSpan(buildingBlock)} pr-3 text-base font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                    {
                      buildingBlock.imageFile &&
                        <img
                          alt={format('image.alt.logoFor', { name: buildingBlock.name })} className='building-block-filter inline mr-2 '
                          src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                          height='20' width='20'
                        />
                    }
                    {buildingBlock.name}
                  </div>
                  {
                    buildingBlock.products &&
                      <div className='col-span-3 pr-3 text-base text-dial-purple whitespace-nowrap overflow-ellipsis overflow-hidden'>
                        {
                          buildingBlock.products.length === 0 && format('general.na')
                        }
                        {
                          buildingBlock.products.length > 0 &&
                            buildingBlock.products.map(p => p.name).join(', ')
                        }
                      </div>
                  }
                  {
                    buildingBlock.workflows &&
                      <div className='col-span-4 text-base text-dial-purple whitespace-nowrap overflow-ellipsis overflow-hidden'>
                        {
                          buildingBlock.workflows && buildingBlock.workflows.length === 0 && format('general.na')
                        }
                        {
                          buildingBlock.workflows && buildingBlock.workflows.length > 0 &&
                            buildingBlock.workflows.map(w => w.name).join(', ')
                        }
                      </div>
                  }
                  <div className={`${maturityColSpan(buildingBlock)} flex flex-row font-semibold opacity-50 text-button-gray-light justify-end`}>
                    {buildingBlock.maturity}
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='border-3 border-transparent hover:border-dial-yellow text-building-block hover:text-dial-yellow cursor-pointer'>
              <div className='h-full flex flex-col border border-dial-gray hover:border-transparent shadow-lg hover:shadow-2xl'>
                <div className='flex flex-row p-1.5 border-b border-dial-gray'>
                  <div className='ml-auto text-button-gray-light text-sm font-semibold'>
                    {buildingBlock.maturity.toUpperCase()}
                  </div>
                </div>
                <div className='flex flex-col h-80 p-4'>
                  <div className='text-2xl font-semibold absolute w-64 2xl:w-80 bg-white bg-opacity-70'>
                    {buildingBlock.name}
                  </div>
                  <div className='m-auto align-middle w-40'>
                    <img
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
                                <div key={`workflow-${workflow.slug}`} className='bg-white p-2 mr-1.5'>
                                  <img
                                    data-tip={format('tooltip.forEntity', { entity: format('workflow.label'), name: workflow.name })}
                                    alt={format('image.alt.logoFor', { name: workflow.name })} className='m-auto h-6 workflow-filter'
                                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
                                  />
                                </div>
                              ))
                          }
                        </div>
                        {
                          workflowOverflow && (
                            <div className='bg-white mr-3 px-2 rounded text-sm'>
                              <span className='text-xl bg-white leading-normal'
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
                                  key={`product-${product.slug}`} className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded'
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
