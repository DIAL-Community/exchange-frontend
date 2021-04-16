import Link from 'next/link'
import { useIntl } from 'react-intl'

import { truncate } from '../../lib/utilities'

const UseCaseCard = ({ useCase, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

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

  return (
    <Link href={`/use-cases/${useCase.slug}`}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-use-case hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-12 my-5 px-4'>
                  <div className='col-span-4 text-base font-semibold'>
                    {truncate(useCase.name, 40, true)}
                  </div>
                  <div className='col-span-2 text-base text-dial-purple'>
                    {
                      useCase.sdgTargets && useCase.sdgTargets.length === 0 && format('general.na')
                    }
                    {
                      useCase.sdgTargets.length > 0 &&
                        truncate(useCase.sdgTargets.map(u => u.targetNumber).join(', '), 60, true)
                    }
                  </div>
                  <div className='col-span-5 text-base text-dial-purple'>
                    {
                      workflows && workflows.length === 0 && format('general.na')
                    }
                    {
                      workflows && workflows.length > 0 &&
                        truncate(workflows.map(b => b.name).join(', '), 60, true)
                    }
                  </div>
                  <div className='col-span-1 flex flex-row font-semibold opacity-50 text-button-gray-light justify-end'>
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
                      <div className='text-base my-auto text-sdg-target mr-2'>{format('use-case.sdg-targets')}</div>
                      <div className='pl-3 flex flex-row flex-wrap font-semibold'>
                        {
                          useCase.sdgTargets.length === 0 &&
                            <div className='bg-white p-2 text-use-case rounded text-base'>
                              {format('general.na')}
                            </div>
                        }
                        {
                          useCase.sdgTargets
                            .filter((_, index) => index <= 3)
                            .map(sdgTarget => (
                              <div key={`workflow-${useCase.slug}`} className='bg-white rounded text-sdg-target p-2 mr-1.5'>
                                {sdgTarget.targetNumber}
                              </div>
                            ))
                        }
                        {
                          useCase.sdgTargets.length > 4 && (
                            <div className='bg-white rounded p-2'>
                              <span className='text-xl text-use-case bg-white leading-none'>...</span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-row text-dial-gray-dark'>
                    <div className='py-3 text-dial-gray-dark flex flex-row'>
                      <div className='pl-3 text-base text-workflow my-auto'>Workflows</div>
                      <div className='pl-3 flex flex-row flex-wrap font-semibold'>
                        {
                          workflows.length === 0 &&
                            <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'>
                              {format('general.na')}
                            </div>
                        }
                        {
                          workflows
                            .filter((_, index) => index <= 2)
                            .map(buildingBlock => (
                              <div key={`workflow-${buildingBlock.slug}`} className='bg-white rounded p-2 mr-1'>
                                <img
                                  className='m-auto h-6 workflow-filter'
                                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                                />
                              </div>
                            ))
                        }
                        {
                          workflows.length > 3 && (
                            <div className='bg-white rounded p-2'>
                              <span className='text-xl text-building-block bg-white leading-none'>...</span>
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
