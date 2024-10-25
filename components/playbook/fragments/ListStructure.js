import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { PAGINATED_PLAYBOOKS_QUERY } from '../../shared/query/playbook'
import { DisplayType } from '../../utils/constants'
import PlaybookCard from '../PlaybookCard'

const ListStructure = ({ defaultPageSize, pageOffset }) => {
  const { search, tags, products } = useContext(FilterContext)

  const { loading, error, data } = useQuery(PAGINATED_PLAYBOOKS_QUERY, {
    variables: {
      search,
      owner: 'public',
      products: products.map(product => product.value),
      tags: tags.map(tag => tag.label),
      limit: defaultPageSize,
      offset: pageOffset
    },
    context: {
      headers: {
        ...GRAPH_QUERY_CONTEXT.VIEWING
      }
    }
  })

  if (loading) {
    return handleLoadingQuery()
  } else if (error) {
    return handleQueryError(error)
  } else if (!data?.paginatedPlaybooks) {
    return handleMissingData()
  }

  const { paginatedPlaybooks: playbooks } = data

  return (
    <div className='flex flex-col gap-3'>
      {playbooks.map((playbook, index) =>
        <div key={index}>
          <PlaybookCard
            index={index}
            playbook={playbook}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
