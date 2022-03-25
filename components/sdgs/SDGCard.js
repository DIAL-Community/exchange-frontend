import Link from 'next/link'
import { createRef, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { ToastContext } from '../../lib/ToastContext'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('SDGs')

const ellipsisTextStyle = `
  whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-sdg hover:text-dial-yellow
`

const SDGCard = ({ sdg, listType, filterDisplayed }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const { showToast } = useContext(ToastContext)

  const sdgTargetContainer = createRef()
  const [sdgTargetOverflow, setSdgTargetOverflow] = useState(false)

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

  const navClickHandler = (target) => {
    showToast(`${format('app.openingDetails')} ...`, 'default', 'bottom-right', false)
  }

  const nameColSpan = () => {
    return !useCases
      ? 'col-span-6'
      : filterDisplayed ? 'col-span-6 xl:col-span-2' : 'col-span-5 md:col-span-3 lg:col-span-2'
  }

  const useCaseColSpan = () => {
    return !useCases
      ? 'hidden'
      : filterDisplayed ? 'hidden xl:block 2xl:col-span-4' : 'hidden lg:block lg:col-span-3 lg:col-span-4'
  }

  return (
    <Link href={`/${collectionPath}/${sdg.slug}`}>
      {
        listType === 'list'
          ? (
            <div onClick={() => navClickHandler()} className={containerElementStyle}>
              <div className='bg-white border border-dial-gray hover:border-transparent'>
                <div className='grid grid-cols-1 lg:grid-cols-6 gap-x-4 py-4 px-4'>
                  <div className={`${nameColSpan()} text-base text-sdg font-semibold ${ellipsisTextStyle}`}>
                    <img
                      className='inline pr-4' src={`${process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}`}
                      alt={format('image.alt.logoFor', { name: sdg.name })} width='40' height='40'
                    />
                    {sdg.name}
                    {
                      useCases &&
                        <div
                          className={`
                            block ${filterDisplayed ? ' xl:hidden' : 'lg:hidden'}
                            text-use-case text-sm font-normal flex flex-row mt-1
                          `}
                        >
                          <div className='inline'>
                            {format('useCase.header')}:
                          </div>
                          <div className='mx-1 whitespace-nowrap text-ellipsis overflow-hidden'>
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
                  </div>
                  <div className={`${useCaseColSpan()} text-base text-use-case ${ellipsisTextStyle}`}>
                    {
                      useCases && useCases.length === 0 && format('general.na')
                    }
                    {
                      useCases && useCases.length > 0 &&
                        useCases.map(u => u.name).join(', ')
                    }
                  </div>
                </div>
              </div>
            </div>
          )
          : (
            <div onClick={() => navClickHandler()} className={containerElementStyle}>
              <div className='border border-dial-gray hover:border-transparent drop-shadow'>
                <div className='flex flex-col h-80 p-4'>
                  <div className='text-2xl font-semibold absolute w-64 2xl:w-80 bg-white bg-opacity-70'>
                    {sdg.name}
                  </div>
                  <div className='m-auto align-middle w-40'>
                    <img
                      alt={format('image.alt.logoFor', { name: sdg.name })}
                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + sdg.imageFile}
                    />
                  </div>
                </div>
                <div className='flex flex-col bg-dial-gray-light text-dial-gray-dark cursor-default'>
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
                                <div
                                  key={`${sdg.id}-${sdgTarget.id}`} className='bg-white rounded text-sdg-target p-2 mr-1.5'
                                  data-tip={`${sdgTarget.name}.`}
                                >
                                  {sdgTarget.targetNumber}
                                </div>
                              ))
                          }
                        </div>
                        {
                          sdgTargetOverflow && (
                            <div className='bg-white mr-3 px-2 rounded text-sm text-sdg-target'>
                              <span
                                className='text-xl bg-white leading-normal'
                                data-tip={format('tooltip.ellipsisFor', { entity: format('sdg.label') })}
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
                                    data-tip={format('tooltip.forEntity', { entity: format('useCase.label'), name: useCase.name })}
                                    className='m-auto h-6 use-case-filter' alt={format('image.alt.logoFor', { name: useCase.name })}
                                    src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
                                  />
                                </div>
                              ))
                          }
                        </div>
                        {
                          useCaseOverflow && (
                            <div className='bg-white mr-3 px-2 rounded text-sm'>
                              <span
                                className='text-xl bg-white leading-normal'
                                data-tip={format('tooltip.ellipsisFor', { entity: format('sdg.label') })}
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

export default SDGCard
