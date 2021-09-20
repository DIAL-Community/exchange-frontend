import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import { useSession } from 'next-auth/client'
import { useIntl } from 'react-intl'
import { FilterContext } from '../context/FilterContext'

const SearchFilter = (props) => {
  const { search, setSearch, placeholder } = props
  const { displayType, setDisplayType } = useContext(FilterContext)

  const router = useRouter()
  const { locale } = useRouter()
  const [session] = useSession()

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [searchTerm, setSearchTerm] = useState(search)

  const linkPath = router.asPath.split('/')
  linkPath.shift()
  if (!linkPath[0]) {
    linkPath[0] = 'products'
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => setSearch(searchTerm), 500)
    return () => clearTimeout(timeOutId)
  }, [searchTerm])

  const handleChange = (e) => setSearchTerm(e.target.value)

  const toggleDisplayType = (e) => {
    e.preventDefault()
    setDisplayType(displayType === 'list' ? 'card' : 'list')
  }

  const generateCreateLink = () => {
    if (!session.user) {
      return '/create-not-available'
    }

    const { userEmail, userToken } = session.user
    return `${process.env.NEXT_PUBLIC_RAILS_SERVER}/${linkPath[0]}/` +
      `new?user_email=${userEmail}&user_token=${userToken}&locale=${locale}`
  }

  const generateExportLink = (type) => {
    if (!session.user) {
      return '/export-not-available'
    }

    const { userEmail, userToken } = session.user
    return `${process.env.NEXT_PUBLIC_RAILS_SERVER}/${linkPath[0]}/` +
      `export_data.${type}?user_email=${userEmail}&user_token=${userToken}&locale=${locale}`
  }

  return (
    <div className='relative px-2 grid grid-cols-12 gap-4 bg-transparent max-w-catalog mx-auto'>
      <div className='col-span-12'>
        <div className='flex flex-row flex-wrap mt-2 mr-2'>
          <label className='w-9/12 lg:w-4/12 my-auto'>
            <span className='sr-only'>{format('search.input.label')}</span>
            <input
              type='search'
              value={searchTerm} onChange={handleChange}
              className='form-input text-sm md:text-base py-4 md:py-3 px-4 w-full rounded-md border'
              placeholder={placeholder}
            />
          </label>
          <div className='w-3/12 lg:w-3/12'>
            <div className='flex flex-col md:flex-row'>
              <div className='my-auto px-2 md:px-0 md:pl-2 pt-2 md:pt-0 text-xs md:text-sm lg:text-base text-dial-gray-dark'>{format('view.switch.title')}</div>
              <div className='my-auto pt-2 pb-3 px-2 flex flex-row'>
                {
                  displayType === 'card' &&
                    <>
                      <img className='mr-2 h-6 md:h-8' src='/icons/card-active/card-active.png' />
                      <a href='toggle-display' onClick={toggleDisplayType}>
                        <img className='h-6 md:h-8 cursor-pointer' src='/icons/list-inactive/list-inactive.png' />
                      </a>
                    </>
                }
                {
                  displayType === 'list' &&
                    <>
                      <a className='mr-2' href='toggle-display' onClick={toggleDisplayType}>
                        <img className='h-6 md:h-8 cursor-pointer' src='/icons/card-inactive/card-inactive.png' />
                      </a>
                      <img className='h-6 md:h-8' src='/icons/list-active/list-active.png' />
                    </>
                }
              </div>
            </div>
          </div>
          <div className='w-full lg:w-5/12 mt-2 md:mt-4 text-xs md:text-base text-right'>
            {
              session && session.user.canEdit && (
                <div className='flex justify-end'>
                  <a className='border-b-2 border-transparent hover:border-dial-yellow' href={generateCreateLink()}>
                    <span className='text-dial-yellow'>{format('app.create-new')}</span>
                  </a>
                  <div className='border-r mx-2 border-gray-400' />
                  <a target='_blank' className='border-b-2 border-transparent hover:border-dial-yellow' href={generateExportLink('json')}>
                    <span className='text-dial-yellow'>{format('app.exportAsJson')}</span>
                  </a>
                  <div className='border-r mx-2 border-gray-400' />
                  <a className='border-b-2 border-transparent hover:border-dial-yellow' href={generateExportLink('csv')}>
                    <span className='text-dial-yellow'>{format('app.exportAsCSV')}</span>
                  </a>
                </div>
              )
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default SearchFilter
