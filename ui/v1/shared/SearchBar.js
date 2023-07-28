import { useIntl } from 'react-intl'
import { FaSliders } from 'react-icons/fa6'
import { useCallback, useEffect, useState } from 'react'
import { SearchInput } from './form/SearchInput'

const SearchBar = ({ search, setSearch, startFiltering }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const [searchTerm, setSearchTerm] = useState(search)

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)

    return () => clearTimeout(timeOutId)
  }, [searchTerm, setSearch])

  const handleChange = (e) => setSearchTerm(e.target.value)

  return (
    <div className='flex flex-row gap-3'>
      <div className='block lg:hidden'>
        <button onClick={startFiltering} className='my-auto h-full'>
          <FaSliders className='text-2xl text-dial-sapphire mx-auto' />
        </button>
      </div>
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
