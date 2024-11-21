import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { FilterContext } from '../../context/FilterContext'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../shared/query/country'

const HubCountryTile = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(COUNTRIES_WITH_RESOURCES_SEARCH_QUERY, {
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
  } else if (!data?.countries) {
    return handleMissingData()
  }

  const { countries } = data

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3'>
      {countries.map((country, index) =>
        <Link key={index} href={`/hub/countries/${country.slug}`}>
          <div className='border border-rounded bg-dial-slate-100 flex gap-4 items-center'>
            <img
              src={`https://flagsapi.com/${country.code.toUpperCase()}/flat/64.png`}
              alt={format('ui.country.logoAlt', { countryName: country.code })}
              className='object-contain w-20 h-20 px-4'
            />
            <div className='font-semibold'>
              {country.name}
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export default HubCountryTile
