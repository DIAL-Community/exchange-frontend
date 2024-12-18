import { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { SDG_LIST_QUERY } from '../../shared/query/sdg'
import { DisplayType } from '../../utils/constants'
import SdgCard from '../SdgCard'

const ListStructure = () => {
  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(SDG_LIST_QUERY, {
    variables: { search },
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
  } else if (!data?.sdgs) {
    return handleMissingData()
  }

  const { sdgs } = data

  return (
    <div className='flex flex-col gap-3'>
      {sdgs.map((sdg, index) =>
        <div key={index}>
          <SdgCard
            index={index}
            sdg={sdg}
            displayType={DisplayType.LARGE_CARD}
          />
        </div>
      )}
    </div>
  )
}

export default ListStructure
