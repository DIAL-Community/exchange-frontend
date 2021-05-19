import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useIntl } from 'react-intl'

const SearchFilter = (props) => {
  const { search, setSearch, displayType, setDisplayType, placeholder } = props
  const router = useRouter()
  const [session] = useSession()

  const { formatMessage } = useIntl()
  const format = (id) => formatMessage({ id })

  const [searchTerm, setSearchTerm] = useState(search)

  let linkPath = router.asPath.split('/')
  linkPath.shift();

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
    return `
      ${process.env.NEXT_PUBLIC_RAILS_SERVER}/${linkPath[0]}/new?user_email=${userEmail}&user_token=${userToken}
    `
  }

  return (
    <div className='relative mx-2 grid grid-cols-12 gap-4 bg-transparent'>
      <div className='col-span-12'>
        <div className='flex flex-row mt-2'>
          <label className='block w-4/12 my-auto'>
            <span className='sr-only'>{format('search.input.label')}</span>
            <input
              value={searchTerm} onChange={handleChange}
              className='form-input text-sm md:text-base py-4 md:py-3 px-4 w-full rounded-md border'
              placeholder={placeholder}
            />
          </label>
          <div className='w-2/12'>
            <div className='flex flex-col md:flex-row'>
              <div className='my-auto px-4 md:px-0 md:pl-4 pt-2 md:pt-0 text-xs md:text-base text-dial-gray-dark'>{format('view.switch.title')}</div>
              <div className='my-auto pt-2 pb-3 px-4 flex flex-row'>
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
                      <a href='toggle-display' onClick={toggleDisplayType}>
                        <img className='mr-2 h-6 md:h-8 cursor-pointer' src='/icons/card-inactive/card-inactive.png' />
                      </a>
                      <img className='h-6 md:h-8' src='/icons/list-active/list-active.png' />
                    </>
                }
              </div>
            </div>
          </div>
          <div className='w-6/12 grid mr-4 self-center place-self-end text-sm'>
            { session && session.user.canEdit && (<a href={generateCreateLink()}>
                <span className='grid justify-end text-dial-teal'>{format('app.create-new')}</span>
              </a>)
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default SearchFilter
