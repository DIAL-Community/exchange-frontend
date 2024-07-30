import { createContext, useState } from 'react'

const ProductFilterContext = createContext()
const ProductFilterDispatchContext = createContext()

const ProductFilterProvider = ({ children }) => {
  const [isEndorsed, setIsEndorsed] = useState(false)
  const [productDeployable, setProductDeployable] = useState(false)
  const [origins, setOrigins] = useState([])
  const [countries, setCountries] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [sdgs, setSdgs] = useState([])
  const [tags, setTags] = useState([])
  const [useCases, setUseCases] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [buildingBlocks, setBuildingBlocks] = useState([])
  const [endorsers, setEndorsers] = useState([])
  const [licenseTypes, setLicenseTypes] = useState([])
  const [isLinkedWithDpi, setIsLinkedWithDpi] = useState(false)
  const [showGovStackOnly, setShowGovStackOnly] = useState(false)
  const [showDpgaOnly, setShowDpgaOnly] = useState(false)

  const [softwareCategories, setSoftwareCategories] = useState([])
  const [softwareFeatures, setSoftwareFeatures] = useState([])
  const [comparedProducts, setComparedProducts] = useState([])

  const [search, setSearch] = useState('')

  const [pageNumber, setPageNumber] = useState(0)
  const [pageOffset, setPageOffset] = useState(0)

  const productFilterValues = {
    isEndorsed,
    productDeployable,
    origins,
    countries,
    sectors,
    organizations,
    sdgs,
    tags,
    useCases,
    workflows,
    buildingBlocks,
    endorsers,
    licenseTypes,
    isLinkedWithDpi,
    showGovStackOnly,
    showDpgaOnly,
    softwareCategories,
    softwareFeatures,
    comparedProducts,
    search,
    pageOffset,
    pageNumber
  }

  const productFilterDispatchValues = {
    setIsEndorsed,
    setProductDeployable,
    setOrigins,
    setCountries,
    setSectors,
    setOrganizations,
    setSdgs,
    setTags,
    setUseCases,
    setWorkflows,
    setBuildingBlocks,
    setEndorsers,
    setLicenseTypes,
    setIsLinkedWithDpi,
    setShowGovStackOnly,
    setShowDpgaOnly,
    setSoftwareCategories,
    setSoftwareFeatures,
    setComparedProducts,
    setSearch,
    setPageNumber,
    setPageOffset
  }

  return (
    <ProductFilterContext.Provider value={productFilterValues}>
      <ProductFilterDispatchContext.Provider value={productFilterDispatchValues}>
        {children}
      </ProductFilterDispatchContext.Provider>
    </ProductFilterContext.Provider>
  )
}

export { ProductFilterProvider, ProductFilterContext, ProductFilterDispatchContext }
