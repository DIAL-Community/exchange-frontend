import { useIntl } from 'react-intl'
import { useCallback, useEffect, useState } from 'react'
import { SearchInput } from './form/SearchInput'

const SearchBar = ({ search, setSearch, searchResult }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [searchTerm, setSearchTerm] = useState(search)

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)

    return () => clearTimeout(timeOutId)
  }, [searchTerm, setSearch])

  const handleChange = (e) => setSearchTerm(e.target.value)

  return (
    <div className='flex flex-row'>
      <div className='my-auto'>
        { searchResult }
      </div>
      <div className='ml-auto'>
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
