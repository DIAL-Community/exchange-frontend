import { useIntl } from 'react-intl'
import { useCallback, useEffect, useState } from 'react'
import { SearchInput } from './form/SearchInput'

const SearchBar = ({ search, setSearch, tabletFilter }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [searchTerm, setSearchTerm] = useState(search)

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)

    return () => clearTimeout(timeOutId)
  }, [searchTerm, setSearch])

  const handleChange = (e) => setSearchTerm(e.target.value)

  // TODO: Start filtering = display filter element.
  // Make sure parent are relative and put the filter on top right of the container.

  return (
    <div className='flex flex-row gap-3'>
      {tabletFilter}
      <div className='ml-auto w-full max-w-prose'>
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
