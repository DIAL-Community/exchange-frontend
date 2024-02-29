import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { SearchInput } from '../../shared/form/SearchInput'

const DpiBody = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  // Use this one to actually perform search (or store this in context)
  const [search, setSearch] = useState('')
  // Search field state, only used to control the search input UI
  const [searchTerm, setSearchTerm] = useState(search)

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)

    return () => clearTimeout(timeOutId)
  }, [searchTerm, setSearch])

  const handleChange = (e) => setSearchTerm(e.target.value)

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[50vh] py-12'>
      <div className='flex flex-col gap-6'>
        <div className='text-2xl font-semibold'>
          {format('dpi.landing.main.title')}
        </div>
        <div className='max-w-prose'>
          {format('dpi.landing.main.subtitle')}
        </div>
        <div className='max-w-prose'>
          <SearchInput
            value={searchTerm}
            onChange={handleChange}
            placeholder={format('app.search')}
          />
        </div>
      </div>
    </div>
  )
}

export default DpiBody
