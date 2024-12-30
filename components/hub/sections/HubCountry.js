import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { GRAPH_QUERY_CONTEXT } from '../../../lib/apolloClient'
import { handleLoadingQuery, handleMissingData, handleQueryError } from '../../shared/GraphQueryHandler'
import { DPI_COUNTRY_DETAIL_QUERY } from '../../shared/query/country'
import HubCountryDetail from '../fragments/HubCountryDetail'
import HubBreadcrumb from './HubBreadcrumb'

const HubCountry = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

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

  const slugNameMapping = () => {
    const map = {}
    map[country.slug] = country.name

    return map
  }

  return (
    <div className='flex flex-col gap-6 pb-12 max-w-catalog mx-auto'>
      <img
        className='h-32 w-full object-cover'
        alt='DIAL Resource Hub - Country Profile'
        src='/images/hero-image/hub-country.svg'
      />
      <div className='absolute w-full left-1/2 -translate-x-1/2' style={{ top: 'var(--ui-header-height)' }}>
        <div className='max-w-catalog mx-auto py-2'>
          <div className='px-4 lg:px-8 xl:px-56 text-dial-gray'>
            <HubBreadcrumb slugNameMapping={slugNameMapping} />
          </div>
        </div>
        <div className='max-w-catalog mx-auto py-1'>
          <div className='flex gap-4 px-4 lg:px-8 xl:px-56'>
            <img
              src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
              alt={format('ui.country.logoAlt', { countryName: country.code })}
              className='h-16'
            />
            <div className='text-2xl text-dial-cotton my-auto'>
              {country.name}
            </div>
          </div>
        </div>
      </div>
      <HubCountryDetail country={country} />
    </div>
  )
}

export default HubCountry
