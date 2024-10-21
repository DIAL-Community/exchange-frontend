import { useQuery } from '@apollo/client'
import { useContext } from 'react'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
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
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.paginatedPlaybooks) {
    return <NotFound />
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
