import React, { useContext, useState } from 'react'
import Link from 'next/link'

import { HiChevronDown, HiChevronUp, HiQuestionMarkCircle } from 'react-icons/hi'

import ProductFilter from './ProductFilter'
import BuildingBlockFilter from './BuildingBlockFilter'
import WorkflowFilter from './WorkflowFilter'
import UseCaseFilter from './UseCaseFilter'
import ProjectFilter from './ProjectFilter'
import OrganizationFilter from './OrganizationFilter'
import MapFilter from './MapFilter'
import SDGFilter from './SDGFilter'

import { FilterContext } from '../context/FilterContext'

import withApollo from '../../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import FilterHint from './FilterHint'

import { useIntl } from 'react-intl'
import { QueryParamContext } from '../context/QueryParamContext'
import { truncate } from '../../lib/utilities'

const COUNT_QUERY = gql`
  query Counts {
    counts {
      sdgCount
      useCaseCount
      workflowCount
      buildingBlockCount
      productCount
      projectCount
      orgCount
      mapCount
    }
  }
`

const filterItems = [
  'filter.entity.sdgs', 'filter.entity.useCases', 'filter.entity.workflows', 'filter.entity.buildingBlocks', 'filter.entity.products',
  'filter.entity.projects', 'filter.entity.organizations', 'filter.entity.maps'
]

const mappedUrls = {
  'filter.entity.sdgs': 'sdgs',
  'filter.entity.useCases': 'use_cases',
  'filter.entity.workflows': 'workflows',
  'filter.entity.buildingBlocks': 'building_blocks',
  'filter.entity.products': 'products',
  'filter.entity.projects': 'projects',
  'filter.entity.organizations': 'organizations',
  'filter.entity.maps': 'maps'
}

const Filter = (props) => {
  const { formatMessage } = useIntl()
  const format = (id, values) => formatMessage({ id: id }, values)

  const activeTab = filterItems.indexOf(props.activeTab)
  const [openHint, setOpenHint] = useState(false)

  const { setInteractionDetected } = useContext(QueryParamContext)
  const { resultCounts, openFilter, setResultCounts, setOpenFilter } = useContext(FilterContext)

  useQuery(COUNT_QUERY, {
    onCompleted: (data) => {
      setResultCounts({
        'filter.entity.sdgs': data.counts.sdgCount,
        'filter.entity.useCases': data.counts.useCaseCount,
        'filter.entity.workflows': data.counts.workflowCount,
        'filter.entity.buildingBlocks': data.counts.buildingBlockCount,
        'filter.entity.products': data.counts.productCount,
        'filter.entity.projects': data.counts.projectCount,
        'filter.entity.organizations': data.counts.orgCount,
        'filter.entity.maps': data.counts.mapCount
      })
    }
  })

  const openFilterPanel = (e) => {
    e.preventDefault()
    setOpenFilter(!openFilter)
    setInteractionDetected(true)
  }

  return (
    <>
      <div className='sticky px-2 py-1 bg-white sticky-under-header max-w-catalog mx-auto'>
        <div className='invisible 2xl:visible' style={{ maxWidth: 'calc(62.5% - 4px)' }}>
          <div className='px-5 mt-3 py-2 border-t border-r border-l border-gray-300 rounded-t' />
          <div className='text-center -mt-7' style={{ lineHeight: 0.1 }}>
            <span className='bg-white px-3'>
              <span className='text-sm font-bold text-gray-500'>{format('digiInvestment.title')}</span>
              <HiQuestionMarkCircle className='ml-1 inline' data-tip={format('digiInvestment.tooltip')} data-html />
            </span>
          </div>
        </div>
        <div className='text-right -mt-4'>
          <Link href='/wizard'>
            <a href='/wizard' className='text-sm border-b-2 border-transparent text-dial-yellow font-bold hover:border-dial-yellow'>
              {format('filter.launchWizard')}
            </a>
          </Link>
        </div>
      </div>
      <div className='relative md:sticky bg-white px-2 md:sticky-filter max-w-catalog mx-auto'>
        <div className='w-full'>
          <ul className='flex flex-row mb-0 list-none pt-2'>
            {
              // Logic to display filter elements navs:
              // * sm will have single item in the filter --> hide all li that is not the current active tab.
              // * md and up will have 3 items in the filter
              // * --> activeTab + 1 & activeTab - 1
              // * --> Last element: 2 elements on the left for last element, 2 elements on the right for first element.
              // Logic Display partial element for:
              // * sm: count of the activeTab - 1 & title of the activeTab + 1
              // * --> Last element: show count of activeTab - 1 for last element, show activeTab + 1 title for first element.
              // * md: count of the activeTab - 2 & title of the activeTab + 2
              // * --> Last element: show count of activeTab - 3 for last element, show activeTab + 3 title for first element.
              filterItems.map((filterItem, index) => {
                let href = mappedUrls[filterItem]
                if (href.indexOf('map') >= 0) {
                  href = `${href}/projects`
                }

                return (
                  <React.Fragment key={`menu-${filterItem}`}>
                    <li
                      className={`
                        -mb-px mr-2 last:mr-0 2xl:hidden
                        ${
                          // Similar logic with the right most filter tab, but for left side.
                          ''
                        }
                        ${index === activeTab - 1 ? 'block' : 'hidden'}
                        ${index === activeTab - 2 && activeTab !== filterItems.length - 1
                          ? 'md:block'
                          : index === activeTab - 3 && activeTab === filterItems.length - 1
                            ? 'md:block'
                            : 'md:hidden'
                        }
                        ${index === activeTab - 3 && activeTab !== filterItems.length - 1
                          ? 'xl:block'
                          : index === activeTab - 4 && activeTab === filterItems.length - 1
                            ? 'xl:block'
                            : 'xl:hidden'
                        }
                      `}
                    >
                      <Link href={`/${href}`}>
                        <a
                          className={`
                            text-base font-bold px-3 py-3 block leading-normal rounded
                            bg-gradient-to-r from-white to-dial-gray
                          `}
                          data-toggle='tab'
                          href={`/${href}`}
                        >&nbsp;
                          <span className='float-right p-2 -my-1 text-sm font-bold leading-none rounded text-dial-gray-dark bg-white'>
                            {resultCounts[filterItem]}
                          </span>
                        </a>
                      </Link>
                    </li>
                    <li
                      className={`
                        -mb-px 2xl:block
                        ${
                          // Begin of complex logic to hide and display which filter based on screen size.
                          ''
                        }
                        ${index === filterItems.length - 1 ? 'mr-0' : 'mr-2'}
                        ${index === activeTab ? 'block bg-dial-gray-dark rounded-t' : 'hidden pb-2'}

                        ${
                          // sm: Hide everything on small screen except the active one.
                          ''
                        }
                        ${index > activeTab ? 'sm:hidden' : ''}
                        ${index < activeTab ? 'sm:hidden' : ''}

                        ${
                          // md:
                          // Show one on the left and right of the active tab.
                          // Show 1 more on the right if active tab is the left most.
                          // Show 1 more on the left if active tab is the right most.
                          ''
                        }
                        ${index === activeTab - 1 || index === activeTab + 1 ? 'md:block' : ''}
                        ${activeTab === 0 && index === 2 ? 'md:block' : ''}
                        ${activeTab === filterItems.length - 1 && index === filterItems.length - 3
                          ? 'md:block'
                          : ''
                        }

                        ${
                        // xl (skipping lg breakpoint):
                        // Show one on the left and right of the active tab.
                        // Show 1 more on the right if active tab is the left most.
                        // Show 1 more on the left if active tab is the right most.
                        ''
                        }
                        ${index === activeTab - 2 || index === activeTab + 2 ? 'xl:block' : ''}
                        ${activeTab === 0 && index === 3 ? 'xl:block' : ''}
                        ${activeTab === filterItems.length - 1 && index === filterItems.length - 4
                          ? 'xl:block'
                          : ''
                        }
                      `}
                      style={{ flex: '1 1 0px' }}
                    >
                      <Link href={`/${href}`}>
                        <a
                          className={`
                            text-base font-bold px-3 py-3 block leading-normal
                            ${index === activeTab ? 'text-white' : 'rounded text-dial-gray-dark bg-dial-gray'}
                          `}
                          data-toggle='tab'
                          href={`/${href}`}
                        >
                          {format(filterItem)}
                          <span
                            className={`
                              float-right p-2 -my-1 text-sm font-bold leading-none rounded
                              ${index === activeTab ? 'text-dial-gray-dark bg-dial-yellow' : 'text-dial-gray-dark bg-white'}
                            `}
                          >
                            {resultCounts[filterItem]}
                          </span>
                        </a>
                      </Link>
                    </li>
                    <li
                      className={`
                        -mb-px mr-0 2xl:hidden
                        ${
                          // Logic for displaying the right most filter tab.
                          // Default behavior is hidden on 2xl.
                          // sm: Display one on the right of the active tab
                          ''
                        }
                        ${index === activeTab + 1 ? 'block' : 'hidden'}
                        ${
                          // md:
                          // Display active tab + 2 if active tab is not the left most.
                          // If active tab is the left most, display the active tab + 3
                          ''
                        }
                        ${index === activeTab + 2 && activeTab > 0
                          ? 'md:block'
                          : index === activeTab + 3 && activeTab === 0
                            ? 'md:block'
                            : 'md:hidden'
                        }
                        ${
                          // xl: Shift the above logic one filter position.
                          ''
                        }
                        ${index === activeTab + 3 && activeTab > 0
                          ? 'xl:block'
                          : index === activeTab + 4 && activeTab === 0
                            ? 'xl:block'
                            : 'xl:hidden'
                        }
                      `}
                    >
                      <Link href={`/${href}`}>
                        <a
                          className={`
                            text-base font-bold px-3 py-3 block leading-normal rounded text-dial-gray-dark
                            bg-gradient-to-r from-dial-gray to-white
                          `}
                          data-toggle='tab'
                          href={`/${href}`}
                        >
                          <span className='gradient-text'>{truncate(format(filterItem), 5, false, false)}</span>
                        </a>
                      </Link>
                    </li>
                  </React.Fragment>
                )
              })
            }
          </ul>
          <div className='relative flex flex-col min-w-0 break-words bg-white'>
            {
              !openHint &&
                <div className='bg-dial-gray-dark flex-auto'>
                  <div className='tab-content tab-space'>
                    <div className='flex flex-row'>
                      <div className='px-4 pt-3 pb-2 text-sm text-white cursor-pointer flex-grow' onClick={e => openFilterPanel(e)}>
                        {activeTab === 7 ? format('filter.dropdown.map') : format('filter.dropdown.title', { entity: format(filterItems[activeTab]) })}
                        {openFilter ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />}
                      </div>
                      {
                        // Map doesn't have hint.
                        activeTab < filterItems.length - 1 &&
                          <div className='px-4 pt-3 pb-2 text-white cursor-pointer' onClick={() => setOpenHint(!openHint)}>
                            <span className='hidden md:inline text-sm'>{format('filter.hint.text') + format(props.activeTab).slice(0, -1)}</span>
                            <HiQuestionMarkCircle className='text-2xl inline ml-2' />
                          </div>
                      }
                    </div>
                  </div>
                </div>
            }
            {
              openHint &&
                <FilterHint activeTab={activeTab} openHint={openHint} setOpenHint={setOpenHint} />
            }
          </div>
        </div>
      </div>
      <div className='max-w-catalog mx-auto'>
        <div className='mx-2 bg-dial-gray-dark flex-auto tab-content tab-space'>
          {activeTab === 0 && <SDGFilter openFilter={openFilter} />}
          {activeTab === 1 && <UseCaseFilter openFilter={openFilter} />}
          {activeTab === 2 && <WorkflowFilter openFilter={openFilter} />}
          {activeTab === 3 && <BuildingBlockFilter openFilter={openFilter} />}
          {activeTab === 4 && <ProductFilter openFilter={openFilter} />}
          {activeTab === 5 && <ProjectFilter openFilter={openFilter} />}
          {activeTab === 6 && <OrganizationFilter openFilter={openFilter} />}
          {activeTab === 7 && <MapFilter openFilter={openFilter} />}
        </div>
      </div>
      <div className='max-w-catalog mx-auto md:sticky md:sticky-under-filter'>
        <div className='mx-2 border-b-8 border-dial-yellow rounded-b' />
      </div>
    </>
  )
}

export default withApollo()(Filter)
