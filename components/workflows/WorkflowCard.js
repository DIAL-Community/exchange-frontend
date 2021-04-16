import Link from 'next/link'
import { useIntl } from 'react-intl'

import { truncate } from '../../lib/utilities'

const WorkflowCard = ({ workflow, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

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
                  <div className='col-span-4 text-base font-semibold'>
                    {truncate(workflow.name, 40, true)}
                  </div>
                  <div className='col-span-4 text-base text-dial-purple'>
                    {
                      useCases && useCases.length === 0 && format('general.na')
                    }
                    {
                      useCases && useCases.length > 0 &&
                        truncate(useCases.map(u => u.name).join(', '), 60, true)
                    }
                  </div>
                  <div className='col-span-4 text-base text-dial-purple'>
                    {
                      workflow.buildingBlocks && workflow.buildingBlocks.length === 0 && format('general.na')
                    }
                    {
                      workflow.buildingBlocks && workflow.buildingBlocks.length > 0 &&
                        truncate(workflow.buildingBlocks.map(b => b.name).join(', '), 60, true)
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
                      <div className='text-base my-auto text-use-case mr-2'>Use Cases</div>
                      <div className='pl-3 flex flex-row flex-wrap font-semibold'>
                        {
                          useCases.length === 0 &&
                            <div className='bg-white p-2 text-use-case rounded text-base'>
                              {format('general.na')}
                            </div>
                        }
                        {
                          useCases
                            .filter((_, index) => index <= 3)
                            .map(useCase => (
                              <div key={`workflow-${useCase.slug}`} className='bg-white rounded p-2 mr-1.5'>
                                <img
                                  className='m-auto h-6 use-case-filter'
                                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
                                />
                              </div>
                            ))
                        }
                        {
                          useCases.length > 4 && (
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
                      <div className='pl-3 text-base text-building-block my-auto'>Building Blocks</div>
                      <div className='pl-3 flex flex-row flex-wrap font-semibold'>
                        {
                          workflow.buildingBlocks.length === 0 &&
                            <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'>
                              {format('general.na')}
                            </div>
                        }
                        {
                          workflow.buildingBlocks
                            .filter((_, index) => index <= 3)
                            .map(buildingBlock => (
                              <div key={`workflow-${buildingBlock.slug}`} className='bg-white rounded p-2 mr-1'>
                                <img
                                  className='m-auto h-6 building-block-filter'
                                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + buildingBlock.imageFile}
                                />
                              </div>
                            ))
                        }
                        {
                          workflow.buildingBlocks.length > 4 && (
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

export default WorkflowCard
