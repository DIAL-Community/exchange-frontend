import Link from 'next/link'
import { createRef, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { truncate } from '../../lib/utilities'

const WorkflowCard = ({ workflow, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const buildingBlockContainer = createRef()
  const [buildingBlockOverflow, setBuildingBlockOverflow] = useState(false)

  const useCaseContainer = createRef()
  const [useCaseOverflow, setUseCaseOverflow] = useState(false)

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

  return (
    <Link href={`/workflows/${workflow.slug}`}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-workflow hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-5 px-4'>
                  <div className='col-span-4 pr-3 text-base font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden'>
                    {workflow.name}
                  </div>
                  <div className='col-span-4 pr-3 text-base text-dial-purple whitespace-nowrap overflow-ellipsis overflow-hidden'>
                    {
                      useCases && useCases.length === 0 && format('general.na')
                    }
                    {
                      useCases && useCases.length > 0 &&
                        useCases.map(u => u.name).join(', ')
                    }
                  </div>
                  <div className='col-span-4 pr-3 text-base text-dial-purple whitespace-nowrap overflow-ellipsis overflow-hidden'>
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
                  <div className='text-2xl font-semibold absolute w-80'>
                    {truncate(workflow.name, 40, true)}
                  </div>
                  <div className='m-auto align-middle w-40'>
                    <img
                      alt={`Logo for ${workflow.name}`} className='workflow-filter'
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
                                    className='m-auto h-6 use-case-filter'
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
                        {format('workflow.buildingBlocks')}
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
                                    className='m-auto h-6 building-block-filter'
                                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + b.imageFile}
                                  />
                                </div>
                              ))
                          }
                        </div>
                        {
                          buildingBlockOverflow && (
                            <div className='bg-white mr-3 px-2 rounded text-sm'>
                              <span className='text-xl text-workflow bg-white leading-normal'>...</span>
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
