import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { SECTOR_SEARCH_QUERY } from '../../shared/query/sector'
import Checkbox from '../../shared/form/Checkbox'

export const SectorAutocomplete = ({ sectors, setSectors }) => {
  const { data, error, loading } = useQuery(SECTOR_SEARCH_QUERY)

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.sectors) {
    return <NotFound />
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
