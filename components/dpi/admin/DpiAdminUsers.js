import { useCallback, useContext, useRef, useState } from 'react'
import Link from 'next/link'
import { FiPlusCircle } from 'react-icons/fi'
import { useIntl } from 'react-intl'
import { useUser } from '../../../lib/hooks'
import { UserFilterContext } from '../../context/UserFilterContext'
import UserSearchBar from '../../user/fragments/UserSearchBar'
import UserList from '../users/UserList'
import UserPagination from '../users/UserPagination'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminUsers = () => {
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
      <div className="md:flex">
        <DpiAdminTabs />
        <div className="py-6 px-8 text-medium text-dial-cotton bg-dial-slate-800 rounded-lg w-full min-h-[70vh]">
          <div className='flex justify-end gap-4'>
            <UserSearchBar ref={topRef} />
            {(user.isAdminUser || user.isAdliAdminUser) &&
              <div className='flex items-center'>
                <Link
                  href={'/dpi-admin/users/create'}
                  className='cursor-pointer bg-dial-iris-blue px-4 py-2 rounded text-dial-cotton'
                >
                  <FiPlusCircle className='inline pb-0.5' />
                  <span className='text-sm px-1'>
                    {format('app.create')}
                  </span>
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

export default DpiAdminUsers
