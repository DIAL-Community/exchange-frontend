import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import Checkbox from '../../shared/form/Checkbox'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { SECTOR_SEARCH_QUERY } from '../../shared/query/sector'

export const SectorAutocomplete = ({ sectors, setSectors }) => {
  const { data, error, loading } = useQuery(SECTOR_SEARCH_QUERY, {
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
  } else if (!data?.sectors) {
    return handleMissingData()
  }

  const toggleSector = (id) => {
    if (sectors.indexOf(id) >= 0) {
      setSectors(sectors => sectors.filter(sector => sector !== id))
    } else {
      setSectors(sectors => [...sectors, id])
    }
  }

  return (
    <div className='flex flex-col gap-6 w-full pt-3 pb-12 max-h-[18rem] overflow-auto'>
      {data?.sectors &&
        data?.sectors.map((sector, index) => (
          <div key={index} className='flex gap-2 w-full'>
            <Checkbox
              id={`sector-${index}`}
              className='focus:ring-0'
              onChange={() => toggleSector(sector.id)}
              value={sectors.indexOf(sector.id) >= 0}
            />
            <div className='text-sm'>
              <label htmlFor={`sector-${index}`} className='font-medium text-dial-stratos'>
                {sector.name}
              </label>
            </div>
          </div>
        ))
      }
    </div>
  )
}
