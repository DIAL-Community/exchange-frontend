import { useState } from 'react'
import styles from '../styles/Home.module.css'

import Header from '../components/Header'
import Footer from '../components/Footer'
import WizardHeader from '../components/wizard/WizardHeader'
import WizardContent from '../components/wizard/WizardContent'
import WizardResults from '../components/wizard/WizardResults'
import withApollo from '../lib/apolloClient'

import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const SECTOR_QUERY = gql`
query Sector {
  sectors {
    id
    name
    slug
  }
}
`
const USE_CASE_QUERY = gql`
query UseCases {
  useCases {
    id
    name
    slug
    useCaseDescriptions {
      description
    }
  }
}
`

const COUNTRY_QUERY = gql`
query Countries {
  countries {
    id
    name
    slug
  }
}
`

const TAG_QUERY = gql`
query Tags {
  tags {
    id
    name
    slug
  }
}
`

const WizardPage = () => {
  const [stage, setStage] = useState(0)
  const [allValues, setAllValues] = useState({
    projectPhase: '',
    sector: '',
    useCase: '',
    country: '',
    tags: [],
    mobileServices: [],
    buildingBlocks: []
  });

  const { loading: sectorLoading, error: sectorError, data: sectorData } = useQuery(SECTOR_QUERY)
  const { loading: useCaseLoading, error: useCaseError, data: useCaseData } = useQuery(USE_CASE_QUERY)
  const { loading: countryLoading, error: countryError, data: countryData } = useQuery(COUNTRY_QUERY)
  const { loading: tagLoading, error: tagError, data: tagData } = useQuery(TAG_QUERY)
  if (sectorLoading || useCaseLoading || countryLoading || tagLoading) {
    return <div>Fetching..</div>
  }
  if (sectorError || useCaseError || countryError || tagError) {
    return <div>Error!</div>
  }

  const mobileServices = ['Airtime', 'API', 'HS', 'Mobile-Internet', 'Mobile-Money', 'Ops-Maintenance', 'OTT', 'SLA', 'SMS', 'User-Interface', 'USSD', 'Voice' ]
  const projData = {sectors:[], useCases:[], countries:[], mobileServices: [], tags: [], buildingBlocks: []}
  projData.sectors = sectorData.sectors.map((sector) => { return { label: sector.name, value: sector.name }})
  projData.useCases = useCaseData.useCases.map((useCase) => { return { label: useCase.name, value: useCase.name }})
  projData.countries = countryData.countries.map((country) => { return { label: country.name, value: country.name }})
  projData.tags = tagData.tags.map((tag) => { return { label: tag.name, value: tag.name }})
  projData.mobileServices = mobileServices.map((service) => { return { label: service, value: service}})
  projData.buildingBlocks = ['Data collection', 'Registration','Payments','Identification','Information mediator']

  return (
    <>
      <Header />
      <WizardHeader stage={stage} />
      { stage < 5 ? 
        <WizardContent stage={stage} setStage={setStage} projData={projData} allValues={allValues} setAllValues={setAllValues} />
        :
        <WizardResults stage={stage} setStage={setStage} allValues={allValues} setAllValues={setAllValues} />
      }
      <Footer />
    </>
  )
}

export default withApollo()(WizardPage)
