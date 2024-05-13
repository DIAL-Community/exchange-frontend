import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useUser } from '../../../lib/hooks'
import { UserFilterContext } from '../../context/UserFilterContext'
import CreateButton from '../../shared/form/CreateButton'
import Pagination from '../../shared/Pagination'
import { USER_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/user'
import UserSearchBar from '../../user/fragments/UserSearchBar'
import UserList from '../users/UserList'
import DpiAdminTabs from './DpiAdminTabs'

const DpiAdminUsers = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const DEFAULT_PAGE_SIZE = 5

  const { user } = useUser()
  const { search } = useContext(UserFilterContext)

  const [ pageNumber, setPageNumber ] = useState(0)
  const [ pageOffset, setPageOffset ] = useState(0)

  const topRef = useRef(null)
  const { push, query } = useRouter()

  const { page } = query

  useEffect(() => {
    if (page) {
      setPageNumber(parseInt(page) - 1)
      setPageOffset((parseInt(page) - 1) * DEFAULT_PAGE_SIZE)
    }
  }, [page, setPageNumber, setPageOffset])

  const onClickHandler = ({ nextSelectedPage, selected }) => {
    const destinationPage = typeof nextSelectedPage  === 'undefined' ? selected : nextSelectedPage
    push(
      { query: { ...query, page: destinationPage + 1 } },
      undefined,
      { shallow: true }
    )
    // Scroll to top of the page
    if (topRef && topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start'
      })
    }
  }

  const { loading, error, data } = useQuery(USER_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      roles: ['adli_admin', 'adli_user']
    }
  })

  return (
    <div className='px-4 lg:px-8 xl:px-56 min-h-[80vh] py-8'>
      <div className="md:flex">
        <DpiAdminTabs />
        <div className="py-6 px-8 text-medium text-white bg-dial-slate-800 rounded-lg w-full min-h-[70vh]">
          {(user.isAdminUser || user.isAdliAdminUser) &&
            <div className='flex'>
              <CreateButton
                type='link'
                label={format('app.create')}
                className='ml-auto'
                href={'/dpi-admin/users/create'}
              />
            </div>
          }
          <UserSearchBar ref={topRef} />
          <UserList pageOffset={pageOffset} defaultPageSize={DEFAULT_PAGE_SIZE} />
          { loading && format('ui.pagination.loadingInfo') }
          { error && format('ui.pagination.loadingInfoError') }
          { data &&
            <Pagination
              pageNumber={pageNumber}
              totalCount={data.paginationAttributeUser.totalCount}
              defaultPageSize={DEFAULT_PAGE_SIZE}
              onClickHandler={onClickHandler}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default DpiAdminUsers
