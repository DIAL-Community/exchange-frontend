import { useContext } from 'react'
import { SDGFilterContext, SDGFilterDispatchContext } from '../context/SDGFilterContext'

import { SDGAutocomplete, SDGFilters } from './element/SDG'

const SDGFilter = (props) => {
  const openFilter = props.openFilter

  const { sdgs } = useContext(SDGFilterContext)
  const { setSDGs } = useContext(SDGFilterDispatchContext)

  const hasFilter = () => {
    return sdgs.length > 0
  }

  const clearFilter = (e) => {
    e.preventDefault()
    setSDGs([])
  }

  return (
    <div className='px-2'>
      {
        openFilter &&
          <div className='grid grid-cols-11 gap-4 pb-4 pt-2'>
            <div className='col-span-11 md:col-span-5'>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='text-white text-xl px-2 pb-3'>
                  {'Framework Filters'.toUpperCase()}
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row'>
                <div className='pl-2 pr-4 pb-2'>
                  Use elements of the Digital Investment Framework to filter SDGs
                </div>
              </div>
              <div className='text-sm text-dial-gray-light flex flex-row flex-wrap'>
                <SDGAutocomplete {...{ sdgs, setSDGs }} containerStyles='px-2 pb-2' />
              </div>
            </div>
          </div>
      }
      <div className={`flex flex-row pb-4 ${hasFilter() ? 'block' : 'hidden'}`} id='link1'>
        <div className='px-2 py-1 mt-2 text-sm text-white whitespace-nowrap'>
          Filters Applied:
        </div>
        <div className='flex flex-row flex-wrap'>
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

export default SDGFilter
