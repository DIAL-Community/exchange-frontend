import { useContext } from 'react'
import { MdClose } from 'react-icons/md'
import { BuildingBlockFilterContext, BuildingBlockFilterDispatchContext } from '../context/BuildingBlockFilterContext'

import { SDGAutocomplete, SDGFilters } from './element/SDG'
import { UseCaseAutocomplete, UseCaseFilters } from './element/UseCase'
import { WorkflowAutocomplete, WorkflowFilters } from './element/Workflow'

const BuildingBlockFilter = (props) => {
  const openFilter = props.openFilter

  const {
    showMature, sdgs, useCases, workflows
  } = useContext(BuildingBlockFilterContext)
  const {
    setShowMature, setSDGs, setUseCases, setWorkflows
  } = useContext(BuildingBlockFilterDispatchContext)

  const toggleWithMaturity = () => {
    setShowMature(!showMature)
  }

  const hasFilter = () => {
    return showMature || sdgs.length > 0 || useCases.length > 0 || workflows.length > 0
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setShowMature(false)
    setSDGs([])
    setUseCases([])
    setWorkflows([])
  }

  return (
    <div className='px-2'>
      {
        openFilter &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 md:col-span-5 border-transparent border-r lg:border-dial-purple-light'>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='text-white text-xl px-2 pb-3'>
                  {'Framework Filters'.toUpperCase()}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='pl-2 pr-4 pb-2'>
                  Use elements of the Digital Investment Framework to filter Building Blocks
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
                <UseCaseAutocomplete {...{ useCases, setUseCases }} containerStyles='px-2 pb-2' />
                <WorkflowAutocomplete {...{ workflows, setWorkflows }} containerStyles='px-2 pb-2' />
              </div>
            </div>
            <div className='col-span-11 md:col-span-6 px-4'>
              <div className='text-white text-xl px-2 pb-3'>
                {'Building Block Filters'.toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='px-2 pb-2'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='with-maturity'
                      checked={showMature} onChange={toggleWithMaturity}
                    />
                    <span className='ml-2'>Show only mature building blocks</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${hasFilter() ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          Filters Applied:
        </div>
        <div className='flex flex-row flex-wrap'>
          {
            showMature &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                Show only mature building blocks
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleWithMaturity} />
              </div>
          }
          <WorkflowFilters {...{ workflows, setWorkflows }} />
          <UseCaseFilters {...{ useCases, setUseCases }} />
          <SDGFilters {...{ sdgs, setSDGs }} />
          {
            hasFilter() &&
              <a className='px-2 py-1  mt-2 text-sm text-white' href='#clear-filter' onClick={clearFilter}>
                Clear all
              </a>
          }
        </div>
      </div>
    </div>
  )
}

export default BuildingBlockFilter
