import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { PLAYBOOK_PAGINATION_ATTRIBUTES_QUERY } from '../../shared/query/playbook'
import DpiPagination from '../fragments/DpiPagination'
import { MESSAGE_PAGE_SIZE } from '../message/constant'

const CurriculumPagination = ({ pageNumber, onClickHandler, theme='light' }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(PLAYBOOK_PAGINATION_ATTRIBUTES_QUERY, {
    variables: { owner: 'dpi' }
  })

  if (loading) {
    return format('general.fetchingData')
  } else if (error) {
    return format('general.fetchError')
  } else if (!data?.paginationAttributePlaybook) {
    return format('app.notFound')
  }

  const { paginationAttributePlaybook: { totalCount } } = data

  return (
    <DpiPagination
      pageNumber={pageNumber}
      totalCount={totalCount}
      defaultPageSize={MESSAGE_PAGE_SIZE}
      onClickHandler={onClickHandler}
      theme={theme}
    />
  )
}

export default CurriculumPagination
