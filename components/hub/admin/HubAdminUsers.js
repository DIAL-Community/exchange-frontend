import { useCallback, useContext, useRef, useState } from 'react'
import Link from 'next/link'
import { FiPlusCircle } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { UserFilterContext } from '../../context/UserFilterContext'
import UserSearchBar from '../../user/fragments/UserSearchBar'
import UserList from '../user/UserList'
import UserPagination from '../user/UserPagination'
import HubAdminTabs from './HubAdminTabs'

const HubAdminUsers = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const { search } = useContext(UserFilterContext)

  const [ pageNumber, setPageNumber ] = useState(0)

  const topRef = useRef(null)

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    setPageNumber(destinationPage)
  }

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      <div className='md:flex md:h-full'>
        <HubAdminTabs />
        <div className="py-6 px-6 md:px-8 text-dial-cotton bg-dial-slate-800 rounded-lg w-full min-h-[70vh]">
          <div className='flex lg:justify-end gap-4'>
            <UserSearchBar ref={topRef} />
            {(user.isAdminUser || user.isAdliAdminUser) &&
              <div className='flex items-center'>
                <Link
                  href={'/hub/admin/users/create'}
                  className='cursor-pointer bg-dial-iris-blue px-3 py-2 rounded text-dial-cotton'
                >
                  <div className='flex flex-row gap-1 items-center justify-items-center'>
                    <FiPlusCircle className='inline' />
                    <span className='text-sm'>
                      {format('app.create')}
                    </span>
                  </div>
                </Link>
              </div>
            }
          </div>
          <UserList pageNumber={pageNumber} />
          <UserPagination pageNumber={pageNumber} onClickHandler={onClickHandler} search={search} />
        </div>
      </div>
    </div>
  )
}

export default HubAdminUsers
