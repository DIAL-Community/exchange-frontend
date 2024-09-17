import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const FilterContext = createContext()
const FilterDispatchContext = createContext()

const FilterProvider = ({ children }) => {
  const [search, setSearch] = useState('')
  // Task tracker context only
  const [showFailedOnly, setShowFailedOnly] = useState(false)
  const [showGovStackOnly, setShowGovStackOnly] = useState(false)
  const [showMature, setShowMature] = useState(false)

  const [categoryTypes, setCategoryTypes] = useState([])
  const [sdgs, setSdgs] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])

  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [tags, setTags] = useState([])
  const [datasetTypes, setDatasetTypes] = useState([])

  const [aggregators, setAggregators] = useState([])
  const [operators, setOperators] = useState([])
  const [services, setServices] = useState([])

  const [years, setYears] = useState([])

  const [products, setProducts] = useState([])

  const [buildingBlocks, setBuildingBlocks] = useState([])
  const [showClosed, setShowClosed] = useState(false)

  const [aggregator, setAggregator] = useState(false)
  const [endorser, setEndorser] = useState(false)
  const [endorserLevel, setEndorserLevel] = useState('')

  const [specialties, setSpecialties] = useState([])
  const [certifications, setCertifications] = useState([])

  const [isEndorsed, setIsEndorsed] = useState(false)
  const [endorsers, setEndorsers] = useState([])
  const [licenseTypes, setLicenseTypes] = useState([])
  const [isLinkedWithDpi, setIsLinkedWithDpi] = useState(false)
  const [showDpgaOnly, setShowDpgaOnly] = useState(false)

  const [softwareCategories, setSoftwareCategories] = useState([])
  const [softwareFeatures, setSoftwareFeatures] = useState([])
  const [comparedProducts, setComparedProducts] = useState([])

  const [showBeta, setShowBeta] = useState(false)

  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      console.log('Transitioning from: ', router.pathname)
      console.log('Transitioning from: ', router.asPath)
      console.log('Transitioning to: ', url)

      if (url.indexOf(router.pathname) < 0) {
        setShowBeta(false)
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events, router.asPath, router.pathname])

  const valueProps = {
    search,

    showFailedOnly,
    showGovStackOnly,
    showMature,
    categoryTypes,
    sdgs,
    useCases,
    workflows,

    countries,
    datasetTypes,
    organizations,
    origins,
    sectors,
    tags,

    aggregators,
    operators,
    services,

    years,

    products,

    buildingBlocks,
    showClosed,

    aggregator,
    endorser,
    endorserLevel,
    specialties,
    certifications,

    isEndorsed,
    endorsers,
    licenseTypes,
    isLinkedWithDpi,
    showDpgaOnly,
    softwareCategories,
    softwareFeatures,
    comparedProducts,

    showBeta
  }

  const dispatchProps = {
    setSearch,
    setShowFailedOnly,
    setShowGovStackOnly,
    setShowMature,
    setCategoryTypes,
    setSdgs,
    setUseCases,
    setWorkflows,

    setCountries,
    setDatasetTypes,
    setOrganizations,
    setOrigins,
    setSectors,
    setTags,

    setAggregators,
    setOperators,
    setServices,

    setYears,

    setProducts,

    setBuildingBlocks,
    setShowClosed,

    setAggregator,
    setEndorser,
    setEndorserLevel,
    setSpecialties,
    setCertifications,

    setIsEndorsed,
    setEndorsers,
    setLicenseTypes,
    setIsLinkedWithDpi,
    setShowDpgaOnly,
    setSoftwareCategories,
    setSoftwareFeatures,
    setComparedProducts,

    setShowBeta
  }

  return (
    <FilterContext.Provider value={{ ...valueProps }}>
      <FilterDispatchContext.Provider value={{ ...dispatchProps }}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterContext.Provider>
  )
}

export { FilterProvider, FilterContext, FilterDispatchContext }
