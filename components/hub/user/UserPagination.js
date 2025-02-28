import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Pagination from '../../shared/Pagination'
import { USER_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/user'
import { DEFAULT_PAGE_SIZE } from './constant'

const UserPagination = ({ pageNumber, search, onClickHandler }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(USER_PAGINATION_ATTRIBUTES_QUERY, {
    variables: {
      search,
      roles: ['adli_admin', 'adli_user']
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginationAttributeUser) {
    return format('app.notFound')
  }

  return (
    <Pagination
      pageNumber={pageNumber}
      totalCount={data.paginationAttributeUser.totalCount}
      defaultPageSize={DEFAULT_PAGE_SIZE}
      onClickHandler={onClickHandler}
    />
  )
}

export default UserPagination
