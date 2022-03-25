import Link from 'next/link'
import { createRef, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import ReactTooltip from 'react-tooltip'
import { ToastContext } from '../../lib/ToastContext'
import { convertToKey } from '../context/FilterContext'
const collectionPath = convertToKey('Use Cases')

const ellipsisTextStyle = `
   whitespace-nowrap text-ellipsis overflow-hidden my-auto
`
const containerElementStyle = `
  border-3 cursor-pointer
  border-transparent hover:border-dial-yellow
  text-use-case hover:text-dial-yellow
`

const UseCaseCard = ({ useCase, listType, filterDisplayed, newTab = false }) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id }, { ...values })

  const { showToast } = useContext(ToastContext)

  const sdgTargetContainer = createRef()
  const [sdgTargetOverflow, setSdgTargetOverflow] = useState(false)

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
      ? 'col-span-9 lg:col-span-10'
      : filterDisplayed ? 'col-span-9 lg:col-span-10 xl:col-span-4' : 'col-span-9 md:col-span-10 lg:col-span-4'
  }

  const navClickHandler = (target) => {
    showToast(`${format('app.openingDetails')} ...`, 'default', 'bottom-right', false)
  }

  return (
    <Link href={`/${collectionPath}/${useCase.slug}`}>
      <a {... newTab && { target: '_blank' }}>
        {
          listType === 'list'
            ? (
              <div onClick={() => navClickHandler()} className={containerElementStyle}>
                <div className='bg-white border border-dial-gray hover:border-transparent drop-shadow'>
                  <div className='grid grid-cols-12 gap-x-4 py-4 px-4'>
                    <div className={`${nameColSpan(useCase)} text-base font-semibold ${ellipsisTextStyle}`}>
                      <img
                        alt={format('image.alt.logoFor', { name: useCase.name })} className='m-auto h-6 use-case-filter inline mr-3'
                        src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + useCase.imageFile}
                      />
                      {useCase.name}
                      {
                        useCase.sdgTargets &&
                        <div className={`block ${filterDisplayed ? 'xl:hidden' : 'lg:hidden'} flex flex-row mt-1`}>
                          <div className='text-sm font-normal'>
                            {format('sdg.sdgTargets')}:
                          </div>
                          <div className='mx-1 text-sm font-normal overflow-hidden text-ellipsis'>
                            {useCase.sdgTargets.length === 0 && format('general.na')}
                            {
                              useCase.sdgTargets.length > 0 &&
                                useCase.sdgTargets.map(u => u.targetNumber).join(', ')
                            }
                          </div>
                        </div>
                      }
                      {
                        workflows &&
                        <div className={`block ${filterDisplayed ? 'xl:hidden' : 'lg:hidden'} text-workflow flex flex-row mt-1`}>
                          <div className='text-sm font-normal'>
                            {format('workflow.header')}:
                          </div>
                          <div className='mx-1 text-sm font-normal overflow-hidden text-ellipsis'>
                            {workflows.length === 0 && format('general.na')}
                            {
                              workflows.length > 0 &&
                                workflows.map(b => b.name).join(', ')
                            }
                          </div>
                        </div>
                      }
                    </div>
                    {
                      useCase.sdgTargets &&
                      <div
                        className={`
                          hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                          lg:col-span-2 text-base text-dial-purple ${ellipsisTextStyle}
                        `}
                      >
                        {useCase.sdgTargets.length === 0 && format('general.na')}
                        {
                          useCase.sdgTargets.length > 0 &&
                            useCase.sdgTargets.map(u => u.targetNumber).join(', ')
                        }
                      </div>
                    }
                    {
                      workflows &&
                      <div
                        className={`
                          hidden ${filterDisplayed ? 'xl:block' : 'lg:block'}
                          lg:col-span-5 text-base text-workflow ${ellipsisTextStyle}
                        `}
                      >
                        {workflows.length === 0 && format('general.na')}
                        {
                          workflows.length > 0 &&
                            workflows.map(b => b.name).join(', ')
                        }
                      </div>
                    }
                    <div className='col-span-2 lg:col-span-1 text-right font-semibold opacity-50 justify-end'>
                      {useCase.maturity}
                    </div>
                  </div>
                </div>
              </div>
            )
            : (
              <div onClick={() => navClickHandler()} className={containerElementStyle}>
                <div className='border border-dial-gray hover:border-transparent drop-shadow'>
                  <div className='flex flex-row p-1.5 border-b border-dial-gray'>
                    <div className='ml-auto text-button-gray-light text-sm font-semibold'>
                      {useCase.maturity.toUpperCase()}
                    </div>
                  </div>
                  <div className='flex flex-col h-80 p-4'>
                    <div className='text-2xl font-semibold absolute w-64 2xl:w-80 bg-white bg-opacity-70 z-10'>
                      {useCase.name}
                    </div>
                    <div className='m-auto align-middle w-40'>
                      <img
                        alt={format('image.alt.logoFor', { name: useCase.name })} className='use-case-filter'
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
                                  <div key={`${useCase.id}-${s.id}`} className='bg-white rounded text-sdg-target p-2 mr-1.5 cursor-default' data-tip={`${s.name}.`}>
                                    {s.targetNumber}
                                  </div>
                                ))
                            }
                          </div>
                          {
                            sdgTargetOverflow && (
                              <div className='bg-white mr-3 px-2 rounded text-sm text-sdg-target'>
                                <span
                                  className='text-xl bg-white leading-normal'
                                  data-tip={format('tooltip.ellipsisFor', { entity: format('useCase.label') })}
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
                                  <div key={`${useCase.id}-${w.id}`} className='bg-white rounded p-2 mr-1 cursor-default'>
                                    <img
                                      data-tip={format('tooltip.forEntity', { entity: format('workflow.label'), name: w.name })}
                                      className='m-auto h-6 workflow-filter' alt={format('image.alt.logoFor', { name: w.name })}
                                      src={process.env.NEXT_PUBLIC_GRAPHQL_SERVER + w.imageFile}
                                    />
                                  </div>
                                ))
                            }
                          </div>
                          {
                            workflowOverflow && (
                              <div className='bg-white mr-3 px-2 rounded text-sm'>
                                <span
                                  className='text-xl text-workflow bg-white leading-normal'
                                  data-tip={format('tooltip.ellipsisFor', { entity: format('useCase.label') })}
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
      </a>
    </Link>
  )
}

export default UseCaseCard
