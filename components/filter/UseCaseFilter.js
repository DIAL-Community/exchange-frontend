import { useContext } from 'react'
import { MdClose } from 'react-icons/md'

import { UseCaseFilterContext, UseCaseFilterDispatchContext } from '../context/UseCaseFilterContext'

import { SDGAutocomplete, SDGFilters } from './element/SDG'

const UseCaseFilter = (props) => {
  const openFilter = props.openFilter

  const { sdgs, showBeta } = useContext(UseCaseFilterContext)
  const { setSDGs, setShowBeta } = useContext(UseCaseFilterDispatchContext)

  const hasFilter = () => {
    return sdgs.length > 0 || showBeta
  }

  const toggleShowBeta = () => {
    setShowBeta(!showBeta)
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setSDGs([])
    setShowBeta(false)
  }

  return (
    <div className='px-2'>
      {
        openFilter &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 md:col-span-3 border-transparent border-r lg:border-dial-purple-light'>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='text-white text-xl px-2 pb-3'>
                  {'Framework Filters'.toUpperCase()}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='pl-2 pr-4 pb-2'>
                  Use elements of the Digital Investment Framework to filter Use Cases
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
              </div>
            </div>

            <div className='col-span-11 md:col-span-6 px-4'>
              <div className='text-white text-xl px-2 pb-3'>
                {'Use Case Filters'.toUpperCase()}
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='px-2 pb-2'>
                  <label className='inline-flex items-center'>
                    <input
                      type='checkbox' className='h-4 w-4 form-checkbox text-white' name='show-beta'
                      checked={showBeta} onChange={toggleShowBeta}
                    />
                    <span className='ml-2'>Show Beta (non-Validated) Use Cases</span>
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
            showBeta &&
              <div className='px-2 py-1 mt-2 mr-2 rounded-md bg-dial-yellow text-sm text-dial-gray-dark'>
                Beta (non-Validated) Use Cases
                <MdClose className='ml-3 inline cursor-pointer' onClick={toggleShowBeta} />
              </div>
          }
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

export default UseCaseFilter
