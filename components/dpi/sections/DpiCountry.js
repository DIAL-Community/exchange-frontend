import { useCallback } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { Error, Loading, NotFound } from '../../shared/FetchStatus'
import { DPI_COUNTRY_DETAIL_QUERY } from '../../shared/query/country'
import DpiCountryDetail from '../fragments/DpiCountryDetail'
import DpiBreadcrumb from './DpiBreadcrumb'

const DpiCountry = ({ slug }) => {
  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading, error, data } = useQuery(DPI_COUNTRY_DETAIL_QUERY, {
    variables: { slug }
  })

  if (loading) {
    return <Loading />
  } else if (error) {
    return <Error />
  } else if (!data?.country) {
    return <NotFound />
  }

  const { country } = data

  const slugNameMapping = (() => {
    const map = {}
    map[country.slug] = country.name

    return map
  })()

  return (
    <div className='flex flex-col'>
      <img className='h-80 w-full object-cover' alt='DIAL DPI Resource Hub' src='/images/hero-image/dpi-hero.svg'/>
      <div className='absolute w-full left-1/2 -translate-x-1/2 min-h-[20rem]' style={{ top: 'var(--ui-header-height)' }}>
        <div className='max-w-catalog mx-auto'>
          <div className='px-4 lg:px-8 xl:px-56'>
            <DpiBreadcrumb slugNameMapping={slugNameMapping} />
          </div>
        </div>
        <div className='text-2xl text-center text-white pt-20 pb-4 mx-auto max-w-prose'>
          {country.name}
        </div>
        <img
          src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
          alt={format('ui.country.logoAlt', { countryName: country.code })}
          className='h-16 mx-auto'
        />
      </div>
      <div className='px-4 lg:px-8 xl:px-56 min-h-[70vh] py-8'>
        <DpiCountryDetail country={country} />
      </div>
    </div>
  )
}

export default DpiCountry
