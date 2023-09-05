import React, { createContext, useState } from 'react'

const WizardContext = createContext()
const WizardDispatchContext = createContext()

const WizardContextProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(3)

  const [sdgs, setSdgs] = useState([])
  const [tags, setTags] = useState([])
  const [sectors, setSectors] = useState([])
  const [useCases, setUseCases] = useState([])
  const [countries, setCountries] = useState([])
  const [buildingBlocks, setBuildingBlocks] = useState([])
  const [mobileServices, setMobileServices] = useState([])

  const [searchTags, setSearchTags] = useState('')
  const [searchUseCases, setSearchUseCases] = useState('')
  const [searchCountries, setSearchCountries] = useState('')

  const values = {
    sdgs,
    tags,
    sectors,
    useCases,
    countries,
    buildingBlocks,
    mobileServices,
    searchTags,
    searchUseCases,
    searchCountries,
    currentStep
  }

  const dispatchFn = {
    setSdgs,
    setTags,
    setSectors,
    setUseCases,
    setCountries,
    setBuildingBlocks,
    setMobileServices,
    setSearchTags,
    setSearchUseCases,
    setSearchCountries,
    setCurrentStep
  }

  return (
    <WizardContext.Provider value={values}>
      <WizardDispatchContext.Provider value={dispatchFn}>
        {children}
      </WizardDispatchContext.Provider>
    </WizardContext.Provider>
  )
}

export { WizardContextProvider, WizardContext, WizardDispatchContext }
