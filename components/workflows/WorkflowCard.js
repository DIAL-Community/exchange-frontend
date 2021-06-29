import Link from 'next/link'
import { createRef, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'

import { convertToKey } from '../context/FilterResultContext'
const collectionPath = convertToKey('Workflows')

const ellipsisTextStyle = `
   whitespace-nowrap overflow-ellipsis overflow-hidden
`

const WorkflowCard = ({ workflow, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const buildingBlockContainer = createRef()
  const [buildingBlockOverflow, setBuildingBlockOverflow] = useState(false)

  const useCaseContainer = createRef()
  const [useCaseOverflow, setUseCaseOverflow] = useState(false)

  useEffect(() => {
    ReactTooltip.rebuild()
  })

  useEffect(() => {
    const uc = useCaseContainer.current
    if (uc) {
      const useCaseOverflow = uc.offsetHeight < uc.scrollHeight || uc.offsetWidth < uc.scrollWidth
      setUseCaseOverflow(useCaseOverflow)
    }

    const bc = buildingBlockContainer.current
    if (bc) {
      const buildingBlockOverflow = bc.offsetHeight < bc.scrollHeight || bc.offsetWidth < bc.scrollWidth
      setBuildingBlockOverflow(buildingBlockOverflow)
    }
  }, [useCaseOverflow, buildingBlockOverflow])

  // Get associated use cases through use case steps.
  const useCases = (() => {
    if (!workflow.useCaseSteps) {
      return
    }

    const useCases = []
    workflow.useCaseSteps.map(useCaseStep => {
      const useCaseSlugs = useCases.map(u => u.slug)
      if (useCaseSlugs.indexOf(useCaseStep.useCase.slug) === -1) {
        useCases.push(useCaseStep.useCase)
      }
      return useCaseStep
    })
    return useCases
  })()

  const nameColSpan = () => {
    return !workflow.buildingBlocks && !useCases
      ? 'col-span-12'
      : 'col-span-12 lg:col-span-4'
  }

  return (
    <Link href={`/${collectionPath}/${workflow.slug}`}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-workflow hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-5 px-4'>
                  <div className={`${nameColSpan()} ${ellipsisTextStyle} pr-3 text-base font-semibold`}>
                    {workflow.name}
                    {
                      useCases &&
                        <div className='block lg:hidden text-use-case flex flex-row mt-1 text-use-case'>
                          <div className='text-sm font-normal'>
                            {format('useCase.header')}:
                          </div>
                          <div className='mx-1 text-sm font-normal overflow-hidden overflow-ellipsis'>
                            {
                              useCases.length === 0 && format('general.na')
                            }
                            {
                              useCases.length > 0 &&
                                useCases.map(u => u.name).join(', ')
                            }
                          </div>
                        </div>
                    }
                    {
                      workflow.buildingBlocks &&
                        <div className='block lg:hidden flex flex-row mt-1 text-building-block'>
                          <div className='text-sm font-normal'>
                            {format('building-block.header')}:
                          </div>
                          <div className='mx-1 text-sm font-normal overflow-hidden overflow-ellipsis'>
                            {
                              workflow.buildingBlocks.length === 0 && format('general.na')
                            }
                            {
                              workflow.buildingBlocks.length > 0 &&
                              workflow.buildingBlocks.map(b => b.name).join(', ')
                            }
                          </div>
                        </div>
                    }
                  </div>
                  <div className={`hidden lg:block lg:col-span-4 pr-3 text-base text-use-case ${ellipsisTextStyle}`}>
                    {
                      useCases && useCases.length === 0 && format('general.na')
                    }
                    {
                      useCases && useCases.length > 0 &&
                        useCases.map(u => u.name).join(', ')
                    }
                  </div>
                  <div className={`hidden lg:block lg:col-span-4 pr-3 text-base text-building-block ${ellipsisTextStyle}`}>
                    {
                      workflow.buildingBlocks && workflow.buildingBlocks.length === 0 && format('general.na')
                    }
                    {
                      workflow.buildingBlocks && workflow.buildingBlocks.length > 0 &&
                        workflow.buildingBlocks.map(b => b.name).join(', ')
                    }
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='border-3 border-transparent hover:border-dial-yellow text-building-block hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-lg hover:shadow-2xl'>
                <div className='flex flex-col h-80 p-4'>
                  <div className='text-2xl font-semibold absolute w-64 2xl:w-80 bg-white bg-opacity-70'>
                    {workflow.name}
                  </div>
                  <div className='m-auto align-middle w-40'>
                    <img
                      alt={format('image.alt.logoFor', { name: workflow.name })} className='workflow-filter'
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + workflow.imageFile}
                    />
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark '>
                  <div className='flex flex-row border-b border-dial-gray'>
                    <div className='pl-3 py-3 text-dial-teal-light flex flex-row'>
                      <div className='text-base my-auto whitespace-nowrap text-use-case mr-2'>
                        {format('workflow.useCases')}
                      </div>
                      <div className='flex flex-row'>
                        <div
                          className='pl-3 flex flex-row flex-wrap font-semibold overflow-hidden'
                          style={{ maxHeight: '40px' }}
                          ref={useCaseContainer}
                        >
                          {
                            useCases.length === 0 &&
                              <div className='bg-white p-2 text-use-case rounded text-base'>
                                {format('general.na')}
                              </div>
                          }
                          {
                            useCases
                              .map(u => (
                                <div key={`${workflow.id}-${u.id}`} className='bg-white rounded p-2 mr-1.5'>
                                  <img
                                    data-tip={format('tooltip.forEntity', { entity: format('useCase.label'), name: u.name })}
                                    className='m-auto h-6 use-case-filter' alt={format('image.alt.logoFor', { name: u.name })}
                                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + u.imageFile}
                                  />
                                </div>
                              ))
                          }
                        </div>
                        {
                          useCaseOverflow && (
                            <div className='bg-white mr-3 px-2 rounded text-sm text-use-case'>
                              <span className='text-xl bg-white leading-normal'>...</span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row text-dial-gray-dark'>
                    <div className='py-3 text-dial-gray-dark flex flex-row'>
                      <div className='pl-3 text-base whitespace-nowrap text-building-block my-auto'>
                        {format('building-block.header')}
                      </div>
                      <div className='flex flex-row'>
                        <div
                          className='pl-3 flex flex-row flex-wrap font-semibold overflow-hidden'
                          style={{ maxHeight: '40px' }}
                          ref={buildingBlockContainer}
                        >
                          {
                            workflow.buildingBlocks.length === 0 &&
                              <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'>
                                {format('general.na')}
                              </div>
                          }
                          {
                            workflow.buildingBlocks
                              .map(b => (
                                <div key={`${workflow.id}-${b.slug}`} className='bg-white rounded p-2 mr-1'>
                                  <img
                                    data-tip={format('tooltip.forEntity', { entity: format('buildingBlock.label'), name: b.name })}
                                    className='m-auto h-6 building-block-filter' alt={format('image.alt.logoFor', { name: b.name })}
                                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + b.imageFile}
                                  />
                                </div>
                              ))
                          }
                        </div>
                        {
                          buildingBlockOverflow && (
                            <div className='bg-white mr-3 px-2 rounded text-sm'>
                              <span
                                className='text-xl text-workflow bg-white leading-normal'
                                data-tip={format('tooltip.ellipsisFor', { entity: format('workflow.label') })}
                              >
                                &hellip;
                              </span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )
      }
    </Link>
  )
}

export default WorkflowCard
