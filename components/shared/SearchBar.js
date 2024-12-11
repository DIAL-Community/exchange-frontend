import { useCallback, useContext, useEffect, useState } from 'react'
import { IoGridSharp, IoListSharp } from 'react-icons/io5'
import { useIntl } from 'react-intl'
import { CollectionDisplayType, FilterContext, FilterDispatchContext } from '../context/FilterContext'
import { SearchInput } from './form/SearchInput'

const SearchBar = ({ search, setSearch, mobileFilter }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { collectionDisplayType } = useContext(FilterContext)
  const { setCollectionDisplayType } = useContext(FilterDispatchContext)

  const [searchTerm, setSearchTerm] = useState(search)

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)

    return () => clearTimeout(timeOutId)
  }, [searchTerm, setSearch])

  const handleChange = (e) => setSearchTerm(e.target.value)

  // TODO: Start filtering = display filter element.
  // Make sure parent are relative and put the filter on top right of the container.

  return (
    <div className='flex flex-row items-center justify-items-center gap-3'>
      {mobileFilter}
      <div className='flex flex-row gap-1'>
        <button
          className='flex items-center justify-center'
          disabled={collectionDisplayType === CollectionDisplayType.GRID}
          onClick={() => setCollectionDisplayType(CollectionDisplayType.GRID)}
        >
          <IoGridSharp
            className={collectionDisplayType === CollectionDisplayType.GRID ? 'text-dial-slate-300' : 'text-dial-slate-500'}
            size={24}
          />
        </button>
        <button
          className='flex items-center justify-center'
          disabled={collectionDisplayType === CollectionDisplayType.LIST}
          onClick={() => setCollectionDisplayType(CollectionDisplayType.LIST)}
        >
          <IoListSharp
            className={collectionDisplayType === CollectionDisplayType.LIST ? 'text-dial-slate-300' : 'text-dial-slate-500'}
            size={36}
          />
        </button>
      </div>
      <div className='ml-auto w-full'>
        <SearchInput
          value={searchTerm}
          onChange={handleChange}
          placeholder={format('app.search')}
        />
      </div>
    </div>
  )
}

export default SearchBar
