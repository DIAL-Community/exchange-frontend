import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import Bookmark from '../../shared/common/Bookmark'
import Share from '../../shared/common/Share'
import { ObjectType } from '../../utils/constants'
import {
  OrganizationFilterContext,
  OrganizationFilterDispatchContext
} from '../../../../components/context/OrganizationFilterContext'
import { parseQuery } from '../../utils/share'
import { QueryParamContext } from '../../../../components/context/QueryParamContext'
import StorefrontFilter from './StorefrontFilter'

const StorefrontListLeft = () => {
  const { query } = useRouter()
  const { interactionDetected } = useContext(QueryParamContext)

  const { aggregator, endorser, sectors, countries, years } = useContext(OrganizationFilterContext)
  const { setAggregator, setEndorser, setSectors, setCountries, setYears } = useContext(OrganizationFilterDispatchContext)

  const sharableLink = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL
    const basePath = '/organizations'

    const endorserFilter = endorser ? 'endorser=true' : ''
    const aggregatorFilter = aggregator ? 'aggregator=true' : ''
    const yearFilters = years.map(year => `years=${year.value}--${year.label}`)
    const countryFilters = countries.map(country => `countries=${country.value}--${country.label}`)
    const sectorFilters = sectors.map(sector => `sectors=${sector.value}--${sector.label}`)

    const activeFilter = 'shareCatalog=true'
    const filterParameters = [
      activeFilter, endorserFilter, aggregatorFilter, ...yearFilters, ...countryFilters, ...sectorFilters
    ].filter(f => f).join('&')

    return `${baseUrl}${basePath}?${filterParameters}`
  }

  useEffect(() => {
    // Only apply this if the use have not interact with the UI and the url is a sharable link
    if (
      query &&
      Object.getOwnPropertyNames(query).length > 1 &&
      query.shareCatalog && !interactionDetected
    ) {
      setEndorser(query.endorser === 'true')
      setAggregator(query.aggregator === 'true')
      parseQuery(query, 'years', years, setYears)
      parseQuery(query, 'countries', countries, setCountries)
      parseQuery(query, 'sectors', sectors, setSectors)
    }
  })

  return (
    <div className='bg-dial-slate-100 h-full'>
      <div className='flex flex-col gap-y-3 px-4 lg:px-6 lg:py-3'>
        <StorefrontFilter />
        <Bookmark sharableLink={sharableLink} objectType={ObjectType.URL} />
        <hr className='border-b border-dial-slate-200'/>
        <Share />
        <hr className='border-b border-dial-slate-200'/>
      </div>
    </div>
  )
}

export default StorefrontListLeft
