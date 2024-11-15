import { useCallback, useContext, useEffect, useState } from 'react'
import { FaList } from 'react-icons/fa6'
import { IoGridOutline } from 'react-icons/io5'
import { useIntl } from 'react-intl'
import { FilterContext, FilterDispatchContext } from '../context/FilterContext'
import { MainDisplayType } from '../utils/constants'
import { SearchInput } from './form/SearchInput'

const SearchBar = ({ search, setSearch, mobileFilter }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [searchTerm, setSearchTerm] = useState(search)

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)

    return () => clearTimeout(timeOutId)
  }, [searchTerm, setSearch])

  const handleChange = (e) => setSearchTerm(e.target.value)

  const { displayType } = useContext(FilterContext)
  const { setDisplayType, setDisplayFilter } = useContext(FilterDispatchContext)

  // TODO: Start filtering = display filter element.
  // Make sure parent are relative and put the filter on top right of the container.

  const toggleDisplayType = () => {
    setDisplayFilter(displayType === MainDisplayType.GRID)
    setDisplayType(displayType === MainDisplayType.GRID ? MainDisplayType.LIST : MainDisplayType.GRID)
  }

  return (
    <div className='flex flex-row gap-3'>
      {mobileFilter}
      <div className='ml-auto w-full flex items-center gap-4'>
        <button
          className='text-sm font-medium text-gray-500 hover:text-gray-700'
          onClick={toggleDisplayType}
        >
          {displayType === 'grid'
            ? <IoGridOutline className='w-6 h-6' />
            : <FaList className='w-6 h-6' />
          }
          <span className='sr-only'>{format('app.toggleDisplayType')}</span>
        </button>
        <div className='flex-grow'>
          <SearchInput
            value={searchTerm}
            onChange={handleChange}
            placeholder={format('app.search')}
          />
        </div>
      </div>
    </div >
  )
}

export default SearchBar
