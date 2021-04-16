import Link from 'next/link'
import { useIntl } from 'react-intl'

import { truncate } from '../../lib/utilities'

const SDGCard = ({ sdg, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const useCases = (() => {
    if (!sdg.sdgTargets) {
      return
    }

    const useCases = []
    sdg.sdgTargets.map(sdgTarget => {
      sdgTarget.useCases.map(useCase => {
        const workflowSlugs = useCases.map(u => u.slug)
        if (workflowSlugs.indexOf(useCase.slug) === -1) {
          useCases.push(useCase)
        }
        return useCase
      })
      return sdgTarget
    })
    return useCases
  })()

  return (
    <Link href={`/sdgs/${sdg.slug}`}>
      {
        listType === 'list'
          ? (
            <div className='border-3 border-transparent hover:border-dial-yellow text-use-case hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-sm hover:shadow-lg'>
                <div className='grid grid-cols-3 my-5 px-4'>
                  <div className='col-span-1 text-base text-sdg font-semibold'>
                  <img className='inline pr-4' src={`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}`} alt={sdg.imageFile} width='40' height='40' />
                    {truncate(sdg.name, 40, true)}
                  </div>
                  <div className='col-span-2 text-base text-use-case'>
                    {
                      useCases && useCases.length === 0 && format('general.na')
                    }
                    {
                      useCases && useCases.length > 0 &&
                        truncate(useCases.map(u => u.name).join(', '), 120, true)
                    }
                  </div>
                </div>
              </div>
            </div>
            )
          : (
            <div className='border-3 border-transparent hover:border-dial-yellow text-sdg hover:text-dial-yellow cursor-pointer'>
              <div className='border border-dial-gray hover:border-transparent shadow-lg hover:shadow-2xl'>
                <div className='flex flex-col h-80 p-4'>
                  <div className='text-2xl font-semibold absolute w-80'>
                    {truncate(sdg.name, 40, true)}
                  </div>
                  <div className='m-auto align-middle w-40'>
                    <img
                      alt={`Logo for ${sdg.name}`}
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
                    />
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark '>
                  <div className='flex flex-row border-b border-dial-gray'>
                    <div className='pl-3 py-3 text-dial-teal-light flex flex-row'>
                      <div className='text-base my-auto text-sdg-target mr-2'>SDG Targets</div>
                      <div className='flex flex-row flex-wrap font-semibold'>
                        {
                          sdg.sdgTargets.length === 0 &&
                            <div className='bg-white p-2 text-use-case rounded text-base'>
                              {format('general.na')}
                            </div>
                        }
                        {
                          sdg.sdgTargets
                            .filter((_, index) => index <= 3)
                            .map(sdgTarget => (
                              <div key={`workflow-${sdgTarget.slug}`} className='bg-white rounded text-sdg-target p-2 mr-1.5'>
                                {sdgTarget.targetNumber}
                              </div>
                            ))
                        }
                        {
                          sdg.sdgTargets.length > 4 && (
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
                      <div className='pl-3 text-base text-use-case my-auto'>Use Cases</div>
                      <div className='pl-3 flex flex-row flex-wrap font-semibold'>
                        {
                          useCases.length === 0 &&
                            <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'>
                              {format('general.na')}
                            </div>
                        }
                        {
                          useCases
                            .filter((_, index) => index <= 2)
                            .map(useCase => (
                              <div key={`workflow-${useCase.slug}`} className='bg-white rounded p-2 mr-1'>
                                <img
                                  className='m-auto h-6 use-case-filter'
                                  src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
                                />
                              </div>
                            ))
                        }
                        {
                          useCases.length > 3 && (
                            <div className='bg-white rounded p-2'>
                              <span className='text-xl text-use-case bg-white leading-none'>...</span>
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

export default SDGCard
