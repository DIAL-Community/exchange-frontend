import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Error, Loading } from '../../../../components/shared/FetchStatus'
import { PAGINATED_PLAYBOOKS_QUERY } from '../../shared/query/playbook'
import { PlaybookFilterContext } from '../../../../components/context/PlaybookFilterContext'
import PlaybookCard from '../PlaybookCard'
import { DisplayType } from '../../utils/constants'
import { NotFound } from '../../shared/FetchStatus'

const ListStructure = ({ defaultPageSize, pageOffset }) => {
  const { search } = useContext(PlaybookFilterContext)
  const { tags, products } = useContext(PlaybookFilterContext)

  const { loading, error, data } = useQuery(PAGINATED_PLAYBOOKS_QUERY, {
    variables: {
      search,
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
  } else if (!data?.paginatedPlaybooksRedux) {
    return <NotFound />
  }

  const { paginatedPlaybooksRedux: playbooks } = data

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