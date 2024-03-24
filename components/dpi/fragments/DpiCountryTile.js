import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../../context/FilterContext'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { COUNTRIES_WITH_RESOURCES_SEARCH_QUERY } from '../../shared/query/country'

const DpiCountryTile = () => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { search } = useContext(FilterContext)

  const { loading, error, data } = useQuery(COUNTRIES_WITH_RESOURCES_SEARCH_QUERY, {
    variables: {
      search
    }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.countries) {
    return <NotFound />
  }

  const { countries } = data

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-3'>
      {countries.map((country, index) =>
        <Link key={index} href={`/dpi-countries/${country.slug}`}>
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

export default DpiCountryTile
