import Link from 'next/link'
import { useIntl } from 'react-intl'
import { FiPlusCircle } from 'react-icons/fi'
import { forwardRef, useCallback, useContext } from 'react'
import SearchBar from '../../shared/SearchBar'
import { ResourceFilterContext, ResourceFilterDispatchContext } from '../../context/ResourceFilterContext'
import { useUser } from '../../../lib/hooks'

const ResourceSearchBar = forwardRef((_, ref) => {
  const { search } = useContext(ResourceFilterContext)
  const { setSearch } = useContext(ResourceFilterDispatchContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { user } = useUser()
  const canEdit = user?.isAdminUser || user?.isEditorUser

  return (
    <div className='ml-auto flex gap-x-6 items-center'>
      <div ref={ref}>
        <SearchBar
          search={search}
          setSearch={setSearch}
        />
      </div>
      {canEdit &&
        <Link href='/hub/create'>
          <div className='flex bg-dial-iris-blue text-white px-4 py-2 rounded gap-x-2'>
            <FiPlusCircle className='my-auto' />
            <span className='text-sm'>
              {format('app.create')}
            </span>
          </div>
        </Link>
      }
    </div>
  )
})

ResourceSearchBar.displayName = 'ResourceSearchBar'

export default ResourceSearchBar
