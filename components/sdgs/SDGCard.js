import Link from 'next/link'
import { createRef, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { truncate } from '../../lib/utilities'

const SDGCard = ({ sdg, listType }) => {
  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const sdgTargetContainer = createRef()
  const [sdgTargetOverflow, setSdgTargetOverflow] = useState(false)

  const useCaseContainer = createRef()
  const [useCaseOverflow, setUseCaseOverflow] = useState(false)

  useEffect(() => {
    const uc = useCaseContainer.current
    if (uc) {
      const useCaseOverflow = uc.offsetHeight < uc.scrollHeight || uc.offsetWidth < uc.scrollWidth
      setUseCaseOverflow(useCaseOverflow)
    }

    const sc = sdgTargetContainer.current
    if (sc) {
      const sdgTargetOverflow = sc.offsetHeight < sc.scrollHeight || sc.offsetWidth < sc.scrollWidth
      setSdgTargetOverflow(sdgTargetOverflow)
    }
  }, [useCaseOverflow, sdgTargetOverflow])

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
                <div className='grid grid-cols-1 md:grid-cols-6 gap-4 my-5 px-4'>
                  <div className='col-span-5 md:col-span-3 lg:col-span-2 pr-3 text-base text-sdg font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden'>
                    <img className='inline pr-4' src={`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}`} alt={sdg.imageFile} width='40' height='40' />
                    {sdg.name}
                  </div>
                  <div className='hidden md:block md:col-span-3 lg:col-span-4 text-base text-use-case whitespace-nowrap overflow-ellipsis overflow-hidden'>
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
                      <div className='text-base whitespace-nowrap my-auto text-sdg-target mr-2'>{format('sdg.sdgTargets')}</div>
                      <div className='flex flex-row'>
                        <div
                          className='flex flex-row flex-wrap font-semibold overflow-hidden'
                          style={{ maxHeight: '40px' }}
                          ref={sdgTargetContainer}
                        >
                          {
                            sdg.sdgTargets.length === 0 &&
                              <div className='bg-white p-2 text-use-case rounded text-base'>
                                {format('general.na')}
                              </div>
                          }
                          {
                            sdg.sdgTargets
                              .map(sdgTarget => (
                                <div key={`${sdg.id}-${sdgTarget.id}`} className='bg-white rounded text-sdg-target p-2 mr-1.5'>
                                  {sdgTarget.targetNumber}
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
                    <div className='py-3 text-dial-gray-dark flex flex-row'>
                      <div className='pl-3 text-base text-use-case my-auto'>{format('sdg.useCases')}</div>
                      <div className='flex flex-row'>
                        <div
                          className='pl-3 flex flex-row flex-wrap font-semibold overflow-hidden'
                          style={{ maxHeight: '42px' }}
                          ref={useCaseContainer}
                        >
                          {
                            useCases.length === 0 &&
                              <div className='bg-white mt-1.5 mr-1.5 last:mr-0 p-2 rounded text-sm'>
                                {format('general.na')}
                              </div>
                          }
                          {
                            useCases
                              .map(useCase => (
                                <div key={`${sdg.id}-${useCase.id}`} className='bg-white rounded p-2 mr-1'>
                                  <img
                                    className='m-auto h-6 use-case-filter'
                                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
                                  />
                                </div>
                              ))
                          }
                        </div>
                        {
                          useCaseOverflow && (
                            <div className='bg-white mr-3 px-2 rounded text-sm'>
                              <span className='text-xl bg-white leading-normal'>...</span>
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