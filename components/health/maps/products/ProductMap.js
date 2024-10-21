import { useCallback, useContext, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { FilterContext } from '../../../context/FilterContext'
import { COUNTRIES_QUERY, PRODUCTS_QUERY } from '../../../shared/query/map'
import CountryInfo from './CountryInfo'

const CountryMarkersMaps = (props) => {
  const CountryMarkersMaps = useMemo(() => dynamic(
    () => import('./CountryMarkers'),
    { ssr: false }
  ), [])

  return <CountryMarkersMaps {...props} />
}

const DEFAULT_PAGE_SIZE = 10000

const ProductMap = () => {
  const [selectedCountry, setSelectedCountry] = useState('')
  const { countries, products } = useContext(FilterContext)

  const { formatMessage } = useIntl()
  const format = useCallback((id, values) => formatMessage({ id }, values), [formatMessage])

  const { loading: loadingProducts, data: productData } = useQuery(PRODUCTS_QUERY, {
    variables: {
      first: DEFAULT_PAGE_SIZE,
      countries: countries.map(country => country.value),
      products: products.map(product => product.value)
    }
  })

  const { loading: loadingCountries, data: countryData } = useQuery(COUNTRIES_QUERY)

  // Group product into map of countries with products
  const countriesWithProducts = (() => {
    const countriesWithProducts = {}
    if (countryData) {
      const { countries } = countryData
      countries.forEach(country => {
        countriesWithProducts[country.name] = {
          name: country.name,
          latitude: country.latitude,
          longitude: country.longitude,
          products: []
        }
      })
    }

    if (productData) {
      const { searchProducts: { nodes } } = productData
      nodes.forEach(product => {
        product.countries.forEach(country => {
          const currentCountry = countriesWithProducts[country.name]
          currentCountry?.products.push({ name: product.name, slug: product.slug })
        })
      })
    }

    return countriesWithProducts
  })()

  const country = countriesWithProducts[selectedCountry]
  const loading = loadingProducts || loadingCountries

  return (
    <div className='min-h-[10vh]'>
      <div className='flex flex-row bg-dial-iris-blue rounded-md relative'>
        {loading &&
          <div className='absolute right-3 px-3 py-2 text-sm' style={{ zIndex: 19 }}>
            <div className='text-sm text-dial-stratos'>
              {format('map.loading.indicator')}
            </div>
          </div>
        }
        <CountryMarkersMaps
          countries={countriesWithProducts}
          setSelectedCountry={setSelectedCountry}
        />
        <CountryInfo country={country} />
      </div>
    </div>
  )
}

export default ProductMap
