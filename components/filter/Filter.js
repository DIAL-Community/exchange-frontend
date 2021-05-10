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

import { FilterResultContext } from '../context/FilterResultContext'

import withApollo from '../../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

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
  'SDGs', 'Use Cases', 'Workflows', 'Building Blocks', 'Products', 'Projects',
  'Organizations', 'Maps'
]

const Filter = (props) => {
  const indexableFilterItems = filterItems.map(e => e.replace(/\s+/g, '-').toLowerCase())
  const activeTab = indexableFilterItems.indexOf(props.activeTab)
  const [openFilter, setOpenFilter] = useState(false)

  const { resultCounts, setResultCounts } = useContext(FilterResultContext)

  const { loading, error, data } = useQuery(COUNT_QUERY, {
    onCompleted: (data) => {
      console.log(data)
      setResultCounts({ 'sdgs': data.counts.sdgCount,
        'use-cases': data.counts.useCaseCount,
        'workflows': data.counts.workflowCount,
        'building-blocks': data.counts.buildingBlockCount,
        'products': data.counts.productCount,
        'projects': data.counts.projectCount,
        'organizations': data.counts.orgCount,
        'maps': data.counts.mapCount,
      })
    }
  })

  const clickHandler = (e) => {
    e.preventDefault()
    setOpenFilter(!openFilter)
  }

  return (
    <>
      <div className='sticky mx-2 py-1 bg-white sticky-under-header'>
        <div className='invisible 2xl:visible' style={{ maxWidth: 'calc(62.5% - 4px)' }}>
          <div className='px-5 mt-3 py-2 border-t border-r border-l border-gray-300 rounded-t' />
          <div className='text-center -mt-7' style={{ lineHeight: 0.1 }}>
            <span className='bg-white px-3'>
              <span className='text-sm font-bold text-gray-500'>Digital Investment Framework</span>
              <HiQuestionMarkCircle className='ml-1 inline' />
            </span>
          </div>
        </div>
        <div className='text-right -mt-4'>
          <a href='wizard' className='text-sm text-dial-yellow font-bold hover:underline'>Launch Recommendations Wizard</a>
        </div>
      </div>
      <div className='sticky bg-white mx-2 sticky-filter'>
        <div className='w-full'>
          <ul className='flex flex-row mb-0 list-none pt-2' role='tablist'>
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
                const normalizedFilterItem = filterItem.replace(/\s+/g, '-').toLowerCase()
                // Need to default map viewing to projects (or to endorsers?)
                let href = normalizedFilterItem
                if (href.indexOf('map') >= 0) {
                  href = `${href}/endorsers`
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
                        role='tablist'
                        data-toggle='tab'
                        href={`/${href}`}
                      >&nbsp;
                        <span className='float-right p-2 -my-1 text-sm font-bold leading-none rounded text-dial-gray-dark bg-white'>
                          {resultCounts[normalizedFilterItem]}
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
                          ${index === activeTab ? 'text-white' : 'rounded text-gray-600 bg-dial-gray'}
                        `}
                        role='tablist'
                        data-toggle='tab'
                        href={`/${href}`}
                      >
                        {filterItem}
                        <span
                          className={`
                            float-right p-2 -my-1 text-sm font-bold leading-none rounded
                            ${index === activeTab ? 'text-dial-gray-dark bg-dial-yellow' : 'text-dial-gray-dark bg-white'}
                          `}
                        >
                          {resultCounts[normalizedFilterItem]}
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
                          text-base font-bold px-3 py-3 block leading-normal rounded text-gray-600
                          bg-gradient-to-r from-dial-gray to-white
                        `}
                        role='tablist'
                        data-toggle='tab'
                        href={`/${href}`}
                      >
                        <span className='gradient-text'>{filterItem}</span>
                      </a>
                    </Link>
                  </li>
                </React.Fragment>
              )})
            }
          </ul>
          <div className='relative flex flex-col min-w-0 break-words bg-white'>
            <div className='bg-dial-gray-dark flex-auto'>
              <div className='tab-content tab-space'>
                {
                  filterItems.map((filterItem, index) => (
                    <div key={`filter-panel-${index}`} className={activeTab === index ? 'block' : 'hidden'}>
                      <div className='px-4 pt-3 pb-2 text-sm text-white cursor-pointer' onClick={e => clickHandler(e)}>
                        Filter {filterItem} by
                        {openFilter ? <HiChevronUp className='ml-1 inline text-2xl' /> : <HiChevronDown className='ml-1 inline text-2xl' />}
                      </div>
                      {activeTab === 0 && <SDGFilter openFilter={openFilter} />}
                      {activeTab === 1 && <UseCaseFilter openFilter={openFilter} />}
                      {activeTab === 2 && <WorkflowFilter openFilter={openFilter} />}
                      {activeTab === 3 && <BuildingBlockFilter openFilter={openFilter} />}
                      {activeTab === 4 && <ProductFilter openFilter={openFilter} />}
                      {activeTab === 5 && <ProjectFilter openFilter={openFilter} />}
                      {activeTab === 6 && <OrganizationFilter openFilter={openFilter} />}
                      {activeTab === 7 && <MapFilter openFilter={openFilter} />}
                    </div>
                  ))
                }
              </div>
            </div>
            <div className='border-b-8 border-dial-yellow rounded-b' />
          </div>
        </div>
      </div>
    </>
  )
}

export default withApollo()(Filter)
