import { useContext, useState } from 'react'
import Link from 'next/link'

import { HiChevronDown, HiChevronUp, HiQuestionMarkCircle } from 'react-icons/hi'

import ProductFilter from './ProductFilter'
import BuildingBlockFilter from './BuildingBlockFilter'
import WorkflowFilter from './WorkflowFilter'
import UseCaseFilter from './UseCaseFilter'
import ProjectFilter from './ProjectFilter'
import OrganizationFilter from './OrganizationFilter'

import { FilterResultContext } from '../context/FilterResultContext'
import SDGFilter from './SDGFilter'

const filterItems = [
  'SDGs', 'Use Cases', 'Workflows', 'Building Blocks', 'Products', 'Projects',
  'Organizations', 'Map Views'
]

const Filter = (props) => {
  const indexableFilterItems = filterItems.map(e => e.replace(/\s+/g, '-').toLowerCase())
  const activeTab = indexableFilterItems.indexOf(props.activeTab)
  const [openFilter, setOpenFilter] = useState(false)

  const { resultCounts } = useContext(FilterResultContext)

  const filterMenuStyles = (tab) => `
    text-xs xl:text-sm 2xl:text-base font-bold px-3 2xl:px-4 py-3 block leading-normal
    ${tab === activeTab ? 'text-white' : 'rounded text-gray-600 bg-dial-gray'}
  `

  const listMenuStyles = (tab) => `
    -mb-px mr-2 last:mr-0
    ${tab === activeTab ? 'bg-dial-gray-dark rounded-t' : 'pb-2'}
  `

  const badgeStyles = (tab) => `
    text-xs float-right p-2 -mt-1.5 2xl:-mt-1 text-sm font-bold leading-none rounded
    ${tab === activeTab ? 'text-dial-gray-dark bg-dial-yellow' : 'text-dial-gray-dark bg-white'}
  `

  const clickHandler = (e) => {
    e.preventDefault()
    setOpenFilter(!openFilter)
  }

  return (
    <>
      <div className='sticky mx-2 py-1 bg-white' style={{ top: '60px', zIndex: 20 }}>
        <div className='hidden xl:block' style={{ maxWidth: 'calc(62.5% - 4px)' }}>
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
      <div className='sticky bg-white mx-2' style={{ top: '97px', zIndex: '20' }}>
        <span className='flex flex-wrap'>
          <div className='w-full'>
            <ul className='flex mb-0 list-none flex-wrap pt-2 flex-row' role='tablist'>
              {
                filterItems.map((filterItem, index) => (
                  <li key={`menu-${filterItem}`} className={`${listMenuStyles(index)}`} style={{ flex: '1 1 0px' }}>
                    <Link href={`/${filterItem.replace(/\s+/g, '-').toLowerCase()}`}>
                      <a
                        className={filterMenuStyles(index)} role='tablist'
                        data-toggle='tab' href={`/${filterItem.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        {filterItem}
                        <span className={badgeStyles(index)}>
                          {resultCounts[filterItem.replace(/\s+/g, '-').toLowerCase()]}
                        </span>
                      </a>
                    </Link>
                  </li>
                ))
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
