import React from 'react'

import Link from 'next/link'

import { HiChevronDown, HiChevronUp, HiQuestionMarkCircle } from 'react-icons/hi'
import ProductFilter from './ProductFilter'
import BuildingBlockFilter from './BuildingBlockFilter'
import WorkflowFilter from './WorkflowFilter'
import UseCaseFilter from './UseCaseFilter'
import ProjectFilter from './ProjectFilter'
import OrganizationFilter from './OrganizationFilter'

const filterItems = [
  'SDGs', 'Use Cases', 'Workflows', 'Building Blocks', 'Products', 'Projects',
  'Organizations', 'Map Views'
]

const Filter = (props) => {
  const indexableFilterItems = filterItems.map(e => e.replace(/\s+/g, '-').toLowerCase())
  const activeTab = indexableFilterItems.indexOf(props.activeTab)
  const [openFilter, setOpenFilter] = React.useState(false)

  const filterMenuStyles = (tab) => `
    text-base font-bold px-5 pt-3 pb-4 block leading-normal
    ${tab === activeTab ? 'text-white' : 'rounded text-gray-600 bg-dial-gray'}
  `

  const listMenuStyles = (tab) => `
    -mb-px mr-2 last:mr-0 flex-auto
    ${tab === activeTab ? 'bg-dial-gray-dark rounded-t' : 'pb-2'}
  `

  const badgeStyles = (tab) => `
    float-right px-2 py-2 text-sm font-bold leading-none rounded
    ${tab === activeTab ? 'text-dial-gray-dark bg-dial-yellow' : 'text-dial-gray-dark bg-white'}
  `

  const clickHandler = (e) => {
    e.preventDefault()
    setOpenFilter(!openFilter)
  }

  return (
    <>
      <div className='sticky px-2 py-1 bg-white' style={{ top: '60px' }}>
        <div className='hidden xl:block' style={{ maxWidth: 'calc(62.5% - 16px)' }}>
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
      <div className='sticky bg-white' style={{ top: '97px' }}>
        <span className='flex flex-wrap'>
          <div className='w-full'>
            <ul className='flex mb-0 list-none flex-wrap pt-2 flex-row' role='tablist'>
              {
                filterItems.map((filterItem, index) => (
                  <li key={`menu-${filterItem}`} className={`${listMenuStyles(index)} mx-2`}>
                    <Link href={`/${filterItem.replace(/\s+/g, '-').toLowerCase()}`}>
                      <a
                        className={filterMenuStyles(index)} role='tablist'
                        data-toggle='tab' href={`/${filterItem.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        {filterItem}
                        <span className={badgeStyles(index)}>
                          200
                        </span>
                      </a>
                    </Link>
                  </li>
                ))
              }
            </ul>
            <div className='relative flex flex-col min-w-0 break-words bg-white mb-4 mx-2'>
              <div className='px-4 bg-dial-gray-dark flex-auto'>
                <div className='tab-content tab-space'>
                  {
                    filterItems.map((filterItem, index) => (
                      <div key={`filter-panel-${index}`} className={activeTab === index ? 'block' : 'hidden'}>
                        <div className='px-2 py-4 text-sm text-white' onClick={e => clickHandler(e)}>
                          Filter {filterItem} by
                          {
                            !openFilter &&
                              <HiChevronDown className='ml-1 inline text-2xl' />
                          }
                          {
                            openFilter &&
                              <HiChevronUp className='ml-1 inline text-2xl' />
                          }
                        </div>
                        {
                          activeTab === 1 &&
                            <UseCaseFilter openFilter={openFilter} />
                        }
                        {
                          activeTab === 2 &&
                            <WorkflowFilter openFilter={openFilter} />
                        }
                        {
                          activeTab === 3 &&
                            <BuildingBlockFilter openFilter={openFilter} />
                        }
                        {
                          activeTab === 4 &&
                            <ProductFilter openFilter={openFilter} />
                        }
                        {
                          activeTab === 5 &&
                            <ProjectFilter openFilter={openFilter} />
                        }
                        {
                          activeTab === 6 &&
                            <OrganizationFilter openFilter={openFilter} />
                        }
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className='border-b-8 border-dial-yellow rounded-b' />
            </div>
          </div>
        </span>
      </div>
    </>
  )
}

export default Filter
