import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../shared/GraphQueryHandler'
import { DPI_COUNTRY_DETAIL_QUERY } from '../shared/query/country'
import GovCountryDetail from './fragments/GovCountryDetail'

const GovResources = ({ slug }) => {

  const { loading, error, data } = useQuery(DPI_COUNTRY_DETAIL_QUERY, {
    variables: { slug },
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
  } else if (!data?.country) {
    return handleMissingData()
  }

  const { country } = data

  return (
    <div className='flex flex-col gap-6 pb-12 max-w-catalog mx-auto'>
      <GovCountryDetail country={country} />
    </div>
  )
}

export default GovResources
