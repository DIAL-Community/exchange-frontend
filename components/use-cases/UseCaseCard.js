import Link from 'next/link'
import { createRef, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { truncate } from '../../lib/utilities'

const UseCaseCard = ({ useCase, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const sdgTargetContainer = createRef()
  const [sdgTargetOverflow, setSdgTargetOverflow] = useState(false)

  const workflowContainer = createRef()
  const [workflowOverflow, setWorkflowOverflow] = useState(false)

  useEffect(() => {
    const wc = workflowContainer.current
    if (wc) {
      const workflowOverflow = wc.offsetHeight < wc.scrollHeight || wc.offsetWidth < wc.scrollWidth
      setWorkflowOverflow(workflowOverflow)
    }

    const sc = sdgTargetContainer.current
    if (sc) {
      const sdgTargetOverflow = sc.offsetHeight < sc.scrollHeight || sc.offsetWidth < sc.scrollWidth
      setSdgTargetOverflow(sdgTargetOverflow)
    }
  }, [workflowOverflow, sdgTargetOverflow])

  const workflows = (() => {
    if (!useCase.useCaseSteps) {
      return
    }

    const workflows = []
    useCase.useCaseSteps.map(useCaseStep => {
      useCaseStep.workflows.map(workflow => {
        const workflowSlugs = workflows.map(u => u.slug)
        if (workflowSlugs.indexOf(workflow.slug) === -1) {
          workflows.push(workflow)
        }
        return workflow
      })
      return useCaseStep
    })
    return workflows
  })()

  const nameColSpan = (useCase) => {
    return !useCase.sdgTargets && !workflows
      ? 'col-span-10'
      : 'col-span-4'
  }

  const maturityColSpan = (useCase) => {
    return !useCase.sdgTargets && !workflows
      ? 'col-span-2'
      : 'col-span-1'
  }

  return (
    <Link href={`/use-cases/${useCase.slug}`}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-use-case hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-5 px-4'>
                  <div className={`${nameColSpan(useCase)} col-span-4 pr-3 text-base font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden`}>
                    {useCase.name}
                  </div>
                  {
                    useCase.sdgTargets && 
                      <div className='col-span-2 pr-3 text-base text-dial-purple whitespace-nowrap overflow-ellipsis overflow-hidden'>
                        {
                          useCase.sdgTargets.length === 0 && format('general.na')
                        }
                        {
                          useCase.sdgTargets.length > 0 &&
                            useCase.sdgTargets.map(u => u.targetNumber).join(', ')
                        }
                      </div>
                  }
                  {
                    workflows &&
                      <div className='col-span-5 pr-3 text-base text-dial-purple whitespace-nowrap overflow-ellipsis overflow-hidden'>
                        {
                          workflows.length === 0 && format('general.na')
                        }
                        {
                          workflows.length > 0 &&
                            workflows.map(b => b.name).join(', ')
                        }
                      </div>
                  }
                  <div className={`${maturityColSpan(useCase)} flex flex-row font-semibold opacity-50 text-button-gray-light justify-end`}>
                    {useCase.maturity}
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='border-3 border-transparent hover:border-dial-yellow text-use-case hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-lg hover:shadow-2xl'>
                <div className='flex flex-row p-1.5 border-b border-dial-gray'>
                  <div className='ml-auto text-button-gray-light text-sm font-semibold'>
                    {useCase.maturity.toUpperCase()}
                  </div>
                </div>
                <div className='flex flex-col h-80 p-4'>
                  <div className='text-2xl font-semibold absolute w-80'>
                    {truncate(useCase.name, 40, true)}
                  </div>
                  <div className='m-auto align-middle w-40'>
                    <img
                      alt={`Logo for ${useCase.name}`} className='use-case-filter'
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
                    />
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark '>
                  <div className='flex flex-row border-b border-dial-gray'>
                    <div className='pl-3 py-3 text-dial-teal-light flex flex-row'>
                      <div className='text-base my-auto whitespace-nowrap text-sdg-target mr-2'>{format('use-case.sdg-targets')}</div>
                      <div className='flex flex-row'>
                        <div
                          className='pl-3 flex flex-row flex-wrap font-semibold overflow-hidden'
                          style={{ maxHeight: '40px' }}
                          ref={sdgTargetContainer}
                        >
                          {
                            useCase.sdgTargets.length === 0 &&
                              <div className='bg-white p-2 text-use-case rounded text-base'>
                                {format('general.na')}
                              </div>
                          }
                          {
                            useCase.sdgTargets
                              .map(s => (
                                <div key={`${useCase.id}-${s.id}`} className='bg-white rounded text-sdg-target p-2 mr-1.5'>
                                  {s.targetNumber}
                                </div>
                              ))
                          }
                        </div>
                        {
                          sdgTargetOverflow && (
                            <div className='bg-white mr-3 px-2 rounded text-sm text-sdg-target'>
                              <span className='text-xl bg-white leading-normal'>...</span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row text-dial-gray-dark'>
                    <div className='py-3 flex flex-row'>
                      <div className='pl-3 text-base text-workflow my-auto'>{format('use-case.workflow')}</div>
                      <div className='flex flex-row'>
                        <div
                          className='pl-3 flex flex-row flex-wrap font-semibold overflow-hidden'
                          style={{ maxHeight: '40px' }}
                          ref={workflowContainer}
                        >
                          {
                            workflows.length === 0 &&
                              <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'>
                                {format('general.na')}
                              </div>
                          }
                          {
                            workflows
                              .map(w => (
                                <div key={`${useCase.id}-${w.id}`} className='bg-white rounded p-2 mr-1'>
                                  <img
                                    className='m-auto h-6 workflow-filter'
                                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + w.imageFile}
                                  />
                                </div>
                              ))
                          }
                        </div>
                        {
                          workflowOverflow && (
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

export default UseCaseCard
