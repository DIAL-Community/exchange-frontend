import { createContext, useState } from 'react'

const OrganizationFilterContext = createContext()
const OrganizationFilterDispatchContext = createContext()

const OrganizationFilterProvider = ({ children }) => {
  const [aggregator, setAggregator] = useState(false)
  const [endorser, setEndorser] = useState(false)
  const [endorserLevel, setEndorserLevel] = useState('')
  const [years, setYears] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])

  const [specialties, setSpecialties] = useState([])
  const [certifications, setCertifications] = useState([])
  const [buildingBlocks, setBuildingBlocks] = useState([])

  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const [storefrontPageNumber, setStorefrontPageNumber] = useState(0)
  const [storefrontPageOffset, setStorefrontPageOffset] = useState(0)

  const organizationFilterValues = {
    aggregator,
    endorser,
    endorserLevel,
    years,
    countries,
    sectors,
    specialties,
    certifications,
    buildingBlocks,
    search,
    pageOffset,
    pageNumber,
    storefrontPageOffset,
    storefrontPageNumber
  }

  const organizationFilterDispatchValues = {
    setAggregator,
    setEndorser,
    setEndorserLevel,
    setYears,
    setCountries,
    setSectors,
    setSpecialties,
    setCertifications,
    setBuildingBlocks,
    setSearch,
    setPageNumber,
    setPageOffset,
    setStorefrontPageNumber,
    setStorefrontPageOffset
  }

  return (
    <OrganizationFilterContext.Provider value={organizationFilterValues}>
      <OrganizationFilterDispatchContext.Provider value={organizationFilterDispatchValues}>
        {children}
      </OrganizationFilterDispatchContext.Provider>
    </OrganizationFilterContext.Provider>
  )
}

export { OrganizationFilterProvider, OrganizationFilterContext, OrganizationFilterDispatchContext }
